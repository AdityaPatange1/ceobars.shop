package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func main() {
	// CLI flags
	configFile := flag.String("config", "", "Path to release config JSON file")
	tracksFile := flag.String("tracks", "", "Path to tracks metadata JSON file")
	token := flag.String("token", "", "DistroKid API bearer token (or set DISTROKID_TOKEN env)")
	outputDir := flag.String("output", "./distrokid-releases", "Output directory for downloaded files")
	action := flag.String("action", "prepare", "Action: prepare, upload, list, download-assets")
	dryRun := flag.Bool("dry-run", false, "Dry run - don't actually upload")

	flag.Parse()

	// Get token from env if not provided
	authToken := *token
	if authToken == "" {
		authToken = os.Getenv("DISTROKID_TOKEN")
	}

	switch *action {
	case "prepare":
		if *tracksFile == "" {
			fmt.Println("Usage: distrokid-cli -action prepare -tracks <tracks.json> -output <dir>")
			os.Exit(1)
		}
		prepareReleases(*tracksFile, *outputDir)

	case "download-assets":
		if *tracksFile == "" {
			fmt.Println("Usage: distrokid-cli -action download-assets -tracks <tracks.json> -output <dir>")
			os.Exit(1)
		}
		downloadAssets(*tracksFile, *outputDir)

	case "upload":
		if authToken == "" {
			fmt.Println("Error: DistroKid token required. Use -token flag or set DISTROKID_TOKEN env")
			os.Exit(1)
		}
		if *configFile == "" {
			fmt.Println("Usage: distrokid-cli -action upload -config <release.json> -token <token>")
			os.Exit(1)
		}
		uploadRelease(*configFile, authToken, *dryRun)

	case "list":
		if authToken == "" {
			fmt.Println("Error: DistroKid token required")
			os.Exit(1)
		}
		listReleases(authToken)

	default:
		fmt.Printf("Unknown action: %s\n", *action)
		os.Exit(1)
	}
}

func prepareReleases(tracksFile, outputDir string) {
	data, err := os.ReadFile(tracksFile)
	if err != nil {
		fmt.Printf("Error reading tracks file: %v\n", err)
		os.Exit(1)
	}

	var tracks []TrackMetadata
	if err := json.Unmarshal(data, &tracks); err != nil {
		fmt.Printf("Error parsing tracks JSON: %v\n", err)
		os.Exit(1)
	}

	// Group tracks by album
	albums := make(map[string][]TrackMetadata)
	for _, track := range tracks {
		albums[track.Album] = append(albums[track.Album], track)
	}

	// Create release configs for each album
	os.MkdirAll(outputDir, 0755)

	for albumName, albumTracks := range albums {
		config := ReleaseConfig{
			Title:       albumName,
			Artist:      albumTracks[0].Artist,
			RecordLabel: "SEA Records Worldwide",
			Genre:       "Hip-Hop/Rap",
			ReleaseDate: time.Now().Format("2006-01-02"),
			Tracks:      albumTracks,
			Stores: []string{
				"spotify", "apple-music", "amazon-music", "youtube-music",
				"tidal", "deezer", "pandora", "iheartradio", "soundcloud",
			},
			ExplicitContent: false,
			Composers:       []string{"Aditya Patange"},
			Producers:       []string{"Aditya Patange", "Nickel 9 Productions"},
		}

		// Sanitize filename
		safeAlbumName := strings.ReplaceAll(albumName, "/", "-")
		safeAlbumName = strings.ReplaceAll(safeAlbumName, " ", "-")
		safeAlbumName = strings.ToLower(safeAlbumName)

		configPath := filepath.Join(outputDir, fmt.Sprintf("%s.json", safeAlbumName))
		configData, _ := json.MarshalIndent(config, "", "  ")
		os.WriteFile(configPath, configData, 0644)

		fmt.Printf("Created release config: %s (%d tracks)\n", configPath, len(albumTracks))
	}

	fmt.Printf("\nTotal: %d albums, %d tracks\n", len(albums), len(tracks))
}

func downloadAssets(tracksFile, outputDir string) {
	data, err := os.ReadFile(tracksFile)
	if err != nil {
		fmt.Printf("Error reading tracks file: %v\n", err)
		os.Exit(1)
	}

	var tracks []TrackMetadata
	if err := json.Unmarshal(data, &tracks); err != nil {
		fmt.Printf("Error parsing tracks JSON: %v\n", err)
		os.Exit(1)
	}

	client := &http.Client{Timeout: 120 * time.Second}

	for i, track := range tracks {
		// Create track directory
		safeTitle := strings.ReplaceAll(track.Title, "/", "-")
		safeTitle = strings.ReplaceAll(safeTitle, " ", "-")
		safeTitle = strings.ToLower(safeTitle)
		trackDir := filepath.Join(outputDir, "tracks", safeTitle)
		os.MkdirAll(trackDir, 0755)

		// Download audio
		audioPath := filepath.Join(trackDir, "master.mp3")
		if _, err := os.Stat(audioPath); os.IsNotExist(err) {
			fmt.Printf("[%d/%d] Downloading audio: %s\n", i+1, len(tracks), track.Title)
			downloadFile(client, track.AudioFile, audioPath)
		}

		// Download cover
		coverPath := filepath.Join(trackDir, "cover.jpg")
		if _, err := os.Stat(coverPath); os.IsNotExist(err) {
			fmt.Printf("[%d/%d] Downloading cover: %s\n", i+1, len(tracks), track.Title)
			downloadFile(client, track.CoverArt, coverPath)
		}
	}

	fmt.Printf("\nDownloaded assets for %d tracks to %s\n", len(tracks), outputDir)
}

func downloadFile(client *http.Client, url, dest string) error {
	resp, err := client.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	out, err := os.Create(dest)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, resp.Body)
	return err
}

func uploadRelease(configFile, token string, dryRun bool) {
	data, err := os.ReadFile(configFile)
	if err != nil {
		fmt.Printf("Error reading config file: %v\n", err)
		os.Exit(1)
	}

	var config ReleaseConfig
	if err := json.Unmarshal(data, &config); err != nil {
		fmt.Printf("Error parsing config JSON: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Release: %s by %s\n", config.Title, config.Artist)
	fmt.Printf("Tracks: %d\n", len(config.Tracks))
	fmt.Printf("Stores: %v\n", config.Stores)

	if dryRun {
		fmt.Println("\n[DRY RUN] Would upload to DistroKid")
		return
	}

	client := NewDistroKidClient(token)

	// Upload each track
	for i, track := range config.Tracks {
		fmt.Printf("\n[%d/%d] Uploading: %s\n", i+1, len(config.Tracks), track.Title)

		// Construct local paths (assuming assets were downloaded)
		safeTitle := strings.ReplaceAll(track.Title, "/", "-")
		safeTitle = strings.ReplaceAll(safeTitle, " ", "-")
		safeTitle = strings.ToLower(safeTitle)

		audioPath := filepath.Join("distrokid-releases", "tracks", safeTitle, "master.mp3")
		coverPath := filepath.Join("distrokid-releases", "tracks", safeTitle, "cover.jpg")

		resp, err := client.UploadTrack(audioPath, coverPath, track)
		if err != nil {
			fmt.Printf("  Error: %v\n", err)
			continue
		}

		if resp.Success {
			fmt.Printf("  Success! Release ID: %s\n", resp.ReleaseID)
		} else {
			fmt.Printf("  Failed: %s\n", resp.Message)
		}
	}
}

func listReleases(token string) {
	client := NewDistroKidClient(token)
	data, err := client.GetReleases()
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		os.Exit(1)
	}

	var result map[string]interface{}
	json.Unmarshal(data, &result)

	prettyJSON, _ := json.MarshalIndent(result, "", "  ")
	fmt.Println(string(prettyJSON))
}
