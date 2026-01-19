package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

const (
	BaseURL       = "https://distrokid.com/api/v1"
	UploadURL     = "https://distrokid.com/api/v1/upload"
	NewReleaseURL = "https://distrokid.com/api/v1/releases/new"
)

type DistroKidClient struct {
	AuthToken  string
	HTTPClient *http.Client
}

type TrackMetadata struct {
	ID           int    `json:"id"`
	Title        string `json:"title"`
	Artist       string `json:"artist"`
	Album        string `json:"album"`
	Duration     string `json:"duration"`
	AudioFile    string `json:"file"`
	CoverArt     string `json:"coverArt"`
	Description  string `json:"description"`
	ReleaseDate  string `json:"releaseDate"`
	Instrumental string `json:"instrumental"`
	Genre        string `json:"genre"`
	ISRC         string `json:"isrc,omitempty"`
	UPC          string `json:"upc,omitempty"`
}

type ReleaseConfig struct {
	Title           string   `json:"title"`
	Artist          string   `json:"artist"`
	RecordLabel     string   `json:"recordLabel"`
	Genre           string   `json:"genre"`
	ReleaseDate     string   `json:"releaseDate"`
	CoverArtPath    string   `json:"coverArtPath"`
	Tracks          []TrackMetadata `json:"tracks"`
	Stores          []string `json:"stores"`
	ExplicitContent bool     `json:"explicitContent"`
	Composers       []string `json:"composers"`
	Producers       []string `json:"producers"`
}

type UploadResponse struct {
	Success   bool   `json:"success"`
	ReleaseID string `json:"releaseId,omitempty"`
	Message   string `json:"message,omitempty"`
	Error     string `json:"error,omitempty"`
}

func NewDistroKidClient(authToken string) *DistroKidClient {
	return &DistroKidClient{
		AuthToken: authToken,
		HTTPClient: &http.Client{
			Timeout: 300 * time.Second, // 5 min timeout for uploads
		},
	}
}

func (c *DistroKidClient) doRequest(method, url string, body io.Reader, contentType string) ([]byte, error) {
	req, err := http.NewRequest(method, url, body)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.AuthToken))
	req.Header.Set("User-Agent", "DistroKid/369 CFNetwork/1492.0.1 Darwin/23.3.0")
	if contentType != "" {
		req.Header.Set("Content-Type", contentType)
	}

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("API error %d: %s", resp.StatusCode, string(respBody))
	}

	return respBody, nil
}

func (c *DistroKidClient) UploadTrack(audioPath, coverPath string, metadata TrackMetadata) (*UploadResponse, error) {
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// Add audio file
	audioFile, err := os.Open(audioPath)
	if err != nil {
		return nil, fmt.Errorf("failed to open audio file: %w", err)
	}
	defer audioFile.Close()

	audioPart, err := writer.CreateFormFile("audio", filepath.Base(audioPath))
	if err != nil {
		return nil, err
	}
	io.Copy(audioPart, audioFile)

	// Add cover art
	coverFile, err := os.Open(coverPath)
	if err != nil {
		return nil, fmt.Errorf("failed to open cover file: %w", err)
	}
	defer coverFile.Close()

	coverPart, err := writer.CreateFormFile("cover", filepath.Base(coverPath))
	if err != nil {
		return nil, err
	}
	io.Copy(coverPart, coverFile)

	// Add metadata fields
	writer.WriteField("title", metadata.Title)
	writer.WriteField("artist", metadata.Artist)
	writer.WriteField("album", metadata.Album)
	writer.WriteField("genre", metadata.Genre)
	writer.WriteField("release_date", metadata.ReleaseDate)
	writer.WriteField("description", metadata.Description)

	writer.Close()

	respBody, err := c.doRequest("POST", UploadURL, body, writer.FormDataContentType())
	if err != nil {
		return nil, err
	}

	var response UploadResponse
	if err := json.Unmarshal(respBody, &response); err != nil {
		return nil, err
	}

	return &response, nil
}

func (c *DistroKidClient) CreateRelease(config ReleaseConfig) (*UploadResponse, error) {
	jsonData, err := json.Marshal(config)
	if err != nil {
		return nil, err
	}

	respBody, err := c.doRequest("POST", NewReleaseURL, bytes.NewReader(jsonData), "application/json")
	if err != nil {
		return nil, err
	}

	var response UploadResponse
	if err := json.Unmarshal(respBody, &response); err != nil {
		return nil, err
	}

	return &response, nil
}

func (c *DistroKidClient) GetReleases() ([]byte, error) {
	return c.doRequest("GET", BaseURL+"/releases", nil, "application/json")
}
