#!/usr/bin/env python3
"""
EMINEM PRODUCTION SOUND GENOME ANALYZER
========================================
Military-grade audio analysis engine for reverse-engineering Eminem's production style.

Analyzes:
- Spectral characteristics (frequency distribution, centroid, bandwidth)
- Dynamic range and compression signatures
- EQ curves and frequency balance
- Stereo field characteristics
- Transient and attack profiles
- Harmonic content and distortion
- Tempo, rhythm, and groove patterns
- Loudness metrics (LUFS, dynamic range)
- Reverb and spatial characteristics
"""

import os
import sys
import json
import warnings
import numpy as np
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from datetime import datetime

warnings.filterwarnings('ignore')

try:
    import librosa
    import librosa.display
    import soundfile as sf
except ImportError as e:
    print(f"Error: Required package not found: {e}")
    print("Install with: pip install librosa soundfile numpy scipy")
    sys.exit(1)


@dataclass
class SpectralProfile:
    """Spectral characteristics of audio"""
    centroid_mean: float
    centroid_std: float
    bandwidth_mean: float
    bandwidth_std: float
    rolloff_mean: float
    rolloff_std: float
    flatness_mean: float
    flatness_std: float
    contrast_mean: List[float]
    mfcc_mean: List[float]
    mfcc_std: List[float]


@dataclass
class DynamicsProfile:
    """Dynamic range and compression characteristics"""
    rms_mean: float
    rms_std: float
    rms_max: float
    rms_min: float
    dynamic_range_db: float
    peak_to_rms_ratio: float
    crest_factor: float
    compression_estimate: float
    loudness_lufs_estimate: float


@dataclass
class FrequencyBalance:
    """Frequency band energy distribution"""
    sub_bass_20_60hz: float
    bass_60_250hz: float
    low_mid_250_500hz: float
    mid_500_2000hz: float
    upper_mid_2000_4000hz: float
    presence_4000_6000hz: float
    brilliance_6000_20000hz: float
    bass_to_treble_ratio: float


@dataclass
class StereoProfile:
    """Stereo field characteristics"""
    width_estimate: float
    mono_compatibility: float
    side_to_mid_ratio: float
    correlation: float


@dataclass
class TransientProfile:
    """Transient and attack characteristics"""
    onset_strength_mean: float
    onset_strength_std: float
    onset_rate: float
    attack_sharpness: float
    percussiveness: float


@dataclass
class TempoRhythm:
    """Tempo and rhythm characteristics"""
    bpm: float
    bpm_confidence: float
    beat_strength_mean: float
    beat_regularity: float
    groove_intensity: float


@dataclass
class HarmonicProfile:
    """Harmonic content analysis"""
    harmonic_ratio: float
    percussive_ratio: float
    harmonic_energy: float
    pitch_mean: float
    pitch_std: float
    tonality_estimate: str


@dataclass
class ReverbProfile:
    """Reverb and spatial characteristics"""
    reverb_estimate: float
    decay_time_estimate: float
    spatial_width: float
    room_size_estimate: str


@dataclass
class TrackGenome:
    """Complete production genome for a single track"""
    track_name: str
    file_path: str
    duration: float
    sample_rate: int
    channels: int
    analyzed_at: str
    spectral: SpectralProfile
    dynamics: DynamicsProfile
    frequency_balance: FrequencyBalance
    stereo: StereoProfile
    transients: TransientProfile
    tempo_rhythm: TempoRhythm
    harmonics: HarmonicProfile
    reverb: ReverbProfile


class EminemGenomeAnalyzer:
    """Military-grade audio genome analyzer for Eminem production style"""

    def __init__(self, verbose: bool = True):
        self.verbose = verbose
        self.sr = 22050  # Standard sample rate for analysis

    def log(self, message: str):
        """Print log message if verbose"""
        if self.verbose:
            print(f"  [ANALYZER] {message}")

    def analyze_track(self, audio_path: str) -> Optional[TrackGenome]:
        """Analyze a single audio track and extract production genome"""
        try:
            self.log(f"Loading: {os.path.basename(audio_path)}")

            # Load audio
            y, sr = librosa.load(audio_path, sr=self.sr, mono=False)

            # Handle mono/stereo
            if y.ndim == 1:
                y_mono = y
                y_stereo = np.array([y, y])
                channels = 1
            else:
                y_mono = librosa.to_mono(y)
                y_stereo = y
                channels = y.shape[0]

            duration = librosa.get_duration(y=y_mono, sr=sr)

            self.log(f"Duration: {duration:.2f}s, Channels: {channels}")

            # Extract all profiles
            spectral = self._analyze_spectral(y_mono, sr)
            dynamics = self._analyze_dynamics(y_mono, sr)
            freq_balance = self._analyze_frequency_balance(y_mono, sr)
            stereo = self._analyze_stereo(y_stereo, sr) if channels > 1 else self._default_stereo()
            transients = self._analyze_transients(y_mono, sr)
            tempo_rhythm = self._analyze_tempo_rhythm(y_mono, sr)
            harmonics = self._analyze_harmonics(y_mono, sr)
            reverb = self._analyze_reverb(y_mono, sr)

            genome = TrackGenome(
                track_name=os.path.basename(audio_path),
                file_path=audio_path,
                duration=duration,
                sample_rate=sr,
                channels=channels,
                analyzed_at=datetime.now().isoformat(),
                spectral=spectral,
                dynamics=dynamics,
                frequency_balance=freq_balance,
                stereo=stereo,
                transients=transients,
                tempo_rhythm=tempo_rhythm,
                harmonics=harmonics,
                reverb=reverb
            )

            self.log(f"Analysis complete for: {os.path.basename(audio_path)}")
            return genome

        except Exception as e:
            self.log(f"Error analyzing {audio_path}: {str(e)}")
            return None

    def _analyze_spectral(self, y: np.ndarray, sr: int) -> SpectralProfile:
        """Analyze spectral characteristics"""
        # Spectral centroid (brightness)
        centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]

        # Spectral bandwidth
        bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)[0]

        # Spectral rolloff
        rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)[0]

        # Spectral flatness (tonality)
        flatness = librosa.feature.spectral_flatness(y=y)[0]

        # Spectral contrast
        contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
        contrast_mean = np.mean(contrast, axis=1).tolist()

        # MFCCs (timbre)
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        mfcc_mean = np.mean(mfccs, axis=1).tolist()
        mfcc_std = np.std(mfccs, axis=1).tolist()

        return SpectralProfile(
            centroid_mean=float(np.mean(centroid)),
            centroid_std=float(np.std(centroid)),
            bandwidth_mean=float(np.mean(bandwidth)),
            bandwidth_std=float(np.std(bandwidth)),
            rolloff_mean=float(np.mean(rolloff)),
            rolloff_std=float(np.std(rolloff)),
            flatness_mean=float(np.mean(flatness)),
            flatness_std=float(np.std(flatness)),
            contrast_mean=contrast_mean,
            mfcc_mean=mfcc_mean,
            mfcc_std=mfcc_std
        )

    def _analyze_dynamics(self, y: np.ndarray, sr: int) -> DynamicsProfile:
        """Analyze dynamic range and compression"""
        # RMS energy
        rms = librosa.feature.rms(y=y)[0]
        rms_mean = float(np.mean(rms))
        rms_std = float(np.std(rms))
        rms_max = float(np.max(rms))
        rms_min = float(np.min(rms[rms > 0.001])) if np.any(rms > 0.001) else 0.001

        # Peak amplitude
        peak = float(np.max(np.abs(y)))

        # Dynamic range
        dynamic_range_db = 20 * np.log10(rms_max / rms_min) if rms_min > 0 else 0

        # Crest factor (peak to RMS ratio)
        crest_factor = peak / rms_mean if rms_mean > 0 else 0
        peak_to_rms_ratio = 20 * np.log10(crest_factor) if crest_factor > 0 else 0

        # Compression estimate (lower crest factor = more compression)
        # Typical values: 6-10 dB (heavy compression), 10-15 dB (moderate), 15+ (dynamic)
        compression_estimate = max(0, min(1, (20 - peak_to_rms_ratio) / 14))

        # Estimate LUFS (approximation based on RMS)
        loudness_lufs_estimate = 20 * np.log10(rms_mean + 1e-10) + 10

        return DynamicsProfile(
            rms_mean=rms_mean,
            rms_std=rms_std,
            rms_max=rms_max,
            rms_min=rms_min,
            dynamic_range_db=float(dynamic_range_db),
            peak_to_rms_ratio=float(peak_to_rms_ratio),
            crest_factor=float(crest_factor),
            compression_estimate=float(compression_estimate),
            loudness_lufs_estimate=float(loudness_lufs_estimate)
        )

    def _analyze_frequency_balance(self, y: np.ndarray, sr: int) -> FrequencyBalance:
        """Analyze frequency band energy distribution"""
        # Compute STFT
        D = np.abs(librosa.stft(y))
        freqs = librosa.fft_frequencies(sr=sr)

        # Calculate energy in each band
        def band_energy(low_hz, high_hz):
            mask = (freqs >= low_hz) & (freqs < high_hz)
            if np.sum(mask) == 0:
                return 0.0
            return float(np.mean(np.sum(D[mask, :], axis=0)))

        sub_bass = band_energy(20, 60)
        bass = band_energy(60, 250)
        low_mid = band_energy(250, 500)
        mid = band_energy(500, 2000)
        upper_mid = band_energy(2000, 4000)
        presence = band_energy(4000, 6000)
        brilliance = band_energy(6000, 20000)

        # Normalize to total energy
        total = sub_bass + bass + low_mid + mid + upper_mid + presence + brilliance
        if total > 0:
            sub_bass /= total
            bass /= total
            low_mid /= total
            mid /= total
            upper_mid /= total
            presence /= total
            brilliance /= total

        # Bass to treble ratio
        bass_energy = sub_bass + bass + low_mid
        treble_energy = presence + brilliance
        bass_to_treble = bass_energy / treble_energy if treble_energy > 0 else 1.0

        return FrequencyBalance(
            sub_bass_20_60hz=sub_bass,
            bass_60_250hz=bass,
            low_mid_250_500hz=low_mid,
            mid_500_2000hz=mid,
            upper_mid_2000_4000hz=upper_mid,
            presence_4000_6000hz=presence,
            brilliance_6000_20000hz=brilliance,
            bass_to_treble_ratio=float(bass_to_treble)
        )

    def _analyze_stereo(self, y_stereo: np.ndarray, sr: int) -> StereoProfile:
        """Analyze stereo field characteristics"""
        if y_stereo.shape[0] < 2:
            return self._default_stereo()

        left = y_stereo[0]
        right = y_stereo[1]

        # Mid and side signals
        mid = (left + right) / 2
        side = (left - right) / 2

        # Calculate RMS for each
        mid_rms = np.sqrt(np.mean(mid**2))
        side_rms = np.sqrt(np.mean(side**2))

        # Stereo width estimate (side to mid ratio)
        side_to_mid = side_rms / mid_rms if mid_rms > 0 else 0
        width_estimate = min(1.0, side_to_mid * 2)  # Normalize to 0-1

        # Mono compatibility (correlation between L and R)
        correlation = float(np.corrcoef(left, right)[0, 1])
        mono_compatibility = (correlation + 1) / 2  # Normalize to 0-1

        return StereoProfile(
            width_estimate=float(width_estimate),
            mono_compatibility=float(mono_compatibility),
            side_to_mid_ratio=float(side_to_mid),
            correlation=correlation
        )

    def _default_stereo(self) -> StereoProfile:
        """Default stereo profile for mono files"""
        return StereoProfile(
            width_estimate=0.0,
            mono_compatibility=1.0,
            side_to_mid_ratio=0.0,
            correlation=1.0
        )

    def _analyze_transients(self, y: np.ndarray, sr: int) -> TransientProfile:
        """Analyze transient characteristics"""
        # Onset strength
        onset_env = librosa.onset.onset_strength(y=y, sr=sr)
        onset_strength_mean = float(np.mean(onset_env))
        onset_strength_std = float(np.std(onset_env))

        # Onset detection
        onsets = librosa.onset.onset_detect(y=y, sr=sr, units='time')
        duration = librosa.get_duration(y=y, sr=sr)
        onset_rate = len(onsets) / duration if duration > 0 else 0

        # Attack sharpness (rise time of onsets)
        attack_sharpness = onset_strength_mean / (onset_strength_std + 0.001)

        # Percussiveness
        y_harm, y_perc = librosa.effects.hpss(y)
        perc_energy = np.sum(y_perc**2)
        total_energy = np.sum(y**2)
        percussiveness = perc_energy / total_energy if total_energy > 0 else 0

        return TransientProfile(
            onset_strength_mean=onset_strength_mean,
            onset_strength_std=onset_strength_std,
            onset_rate=float(onset_rate),
            attack_sharpness=float(attack_sharpness),
            percussiveness=float(percussiveness)
        )

    def _analyze_tempo_rhythm(self, y: np.ndarray, sr: int) -> TempoRhythm:
        """Analyze tempo and rhythm"""
        # Tempo detection
        tempo, beats = librosa.beat.beat_track(y=y, sr=sr)

        # Handle both single value and array returns
        if hasattr(tempo, '__len__'):
            bpm = float(tempo[0]) if len(tempo) > 0 else 0.0
        else:
            bpm = float(tempo)

        # Beat strength
        onset_env = librosa.onset.onset_strength(y=y, sr=sr)
        beat_frames = beats if len(beats) > 0 else [0]

        # Ensure beat frames are within bounds
        valid_beats = beat_frames[beat_frames < len(onset_env)]
        if len(valid_beats) > 0:
            beat_strengths = onset_env[valid_beats]
            beat_strength_mean = float(np.mean(beat_strengths))
        else:
            beat_strength_mean = 0.0

        # Beat regularity (consistency of inter-beat intervals)
        if len(beats) > 2:
            intervals = np.diff(beats)
            beat_regularity = 1.0 - (np.std(intervals) / (np.mean(intervals) + 0.001))
            beat_regularity = max(0, min(1, beat_regularity))
        else:
            beat_regularity = 0.5

        # Groove intensity (combination of rhythm strength and variation)
        groove_intensity = beat_strength_mean * (1 + beat_regularity) / 2

        # BPM confidence based on beat regularity
        bpm_confidence = beat_regularity

        return TempoRhythm(
            bpm=bpm,
            bpm_confidence=float(bpm_confidence),
            beat_strength_mean=beat_strength_mean,
            beat_regularity=float(beat_regularity),
            groove_intensity=float(groove_intensity)
        )

    def _analyze_harmonics(self, y: np.ndarray, sr: int) -> HarmonicProfile:
        """Analyze harmonic content"""
        # Harmonic-percussive separation
        y_harm, y_perc = librosa.effects.hpss(y)

        harm_energy = np.sum(y_harm**2)
        perc_energy = np.sum(y_perc**2)
        total_energy = harm_energy + perc_energy

        harmonic_ratio = harm_energy / total_energy if total_energy > 0 else 0.5
        percussive_ratio = perc_energy / total_energy if total_energy > 0 else 0.5

        # Pitch tracking
        pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
        pitch_values = pitches[magnitudes > np.median(magnitudes)]
        pitch_values = pitch_values[pitch_values > 0]

        if len(pitch_values) > 0:
            pitch_mean = float(np.mean(pitch_values))
            pitch_std = float(np.std(pitch_values))
        else:
            pitch_mean = 0.0
            pitch_std = 0.0

        # Tonality estimate
        chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
        chroma_mean = np.mean(chroma, axis=1)
        dominant_pitch_class = np.argmax(chroma_mean)
        pitch_classes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        tonality_estimate = pitch_classes[dominant_pitch_class]

        return HarmonicProfile(
            harmonic_ratio=float(harmonic_ratio),
            percussive_ratio=float(percussive_ratio),
            harmonic_energy=float(harm_energy),
            pitch_mean=pitch_mean,
            pitch_std=pitch_std,
            tonality_estimate=tonality_estimate
        )

    def _analyze_reverb(self, y: np.ndarray, sr: int) -> ReverbProfile:
        """Estimate reverb characteristics"""
        # Compute onset envelope for decay analysis
        onset_env = librosa.onset.onset_strength(y=y, sr=sr)

        # Autocorrelation for decay estimation
        autocorr = np.correlate(onset_env, onset_env, mode='full')
        autocorr = autocorr[len(autocorr)//2:]
        autocorr = autocorr / autocorr[0]

        # Find decay time (when autocorrelation drops to 0.1)
        decay_samples = np.where(autocorr < 0.1)[0]
        if len(decay_samples) > 0:
            decay_time = decay_samples[0] * 512 / sr  # hop_length = 512
        else:
            decay_time = 0.1

        # Reverb estimate based on decay and spectral characteristics
        spectral_flux = np.diff(np.abs(librosa.stft(y)), axis=1)
        flux_mean = np.mean(np.abs(spectral_flux))

        # Lower flux often indicates more reverb (smoother transitions)
        reverb_estimate = 1.0 / (1.0 + flux_mean * 10)

        # Spatial width from high frequency content
        D = np.abs(librosa.stft(y))
        freqs = librosa.fft_frequencies(sr=sr)
        high_freq_mask = freqs > 4000
        high_freq_energy = np.mean(D[high_freq_mask, :])
        total_energy = np.mean(D)
        spatial_width = high_freq_energy / total_energy if total_energy > 0 else 0.5

        # Room size estimate
        if decay_time < 0.3:
            room_size = "small"
        elif decay_time < 0.8:
            room_size = "medium"
        elif decay_time < 1.5:
            room_size = "large"
        else:
            room_size = "hall"

        return ReverbProfile(
            reverb_estimate=float(reverb_estimate),
            decay_time_estimate=float(decay_time),
            spatial_width=float(spatial_width),
            room_size_estimate=room_size
        )


def aggregate_genomes(genomes: List[TrackGenome]) -> Dict[str, Any]:
    """Aggregate multiple track genomes into a unified production signature"""
    if not genomes:
        return {}

    # Initialize aggregators
    spectral_centroids = []
    spectral_bandwidths = []
    dynamics_compressions = []
    dynamics_crest_factors = []
    freq_sub_bass = []
    freq_bass = []
    freq_low_mid = []
    freq_mid = []
    freq_upper_mid = []
    freq_presence = []
    freq_brilliance = []
    stereo_widths = []
    transient_attacks = []
    transient_percs = []
    tempos = []
    harmonic_ratios = []
    reverb_estimates = []
    decay_times = []

    for g in genomes:
        spectral_centroids.append(g.spectral.centroid_mean)
        spectral_bandwidths.append(g.spectral.bandwidth_mean)
        dynamics_compressions.append(g.dynamics.compression_estimate)
        dynamics_crest_factors.append(g.dynamics.crest_factor)
        freq_sub_bass.append(g.frequency_balance.sub_bass_20_60hz)
        freq_bass.append(g.frequency_balance.bass_60_250hz)
        freq_low_mid.append(g.frequency_balance.low_mid_250_500hz)
        freq_mid.append(g.frequency_balance.mid_500_2000hz)
        freq_upper_mid.append(g.frequency_balance.upper_mid_2000_4000hz)
        freq_presence.append(g.frequency_balance.presence_4000_6000hz)
        freq_brilliance.append(g.frequency_balance.brilliance_6000_20000hz)
        stereo_widths.append(g.stereo.width_estimate)
        transient_attacks.append(g.transients.attack_sharpness)
        transient_percs.append(g.transients.percussiveness)
        tempos.append(g.tempo_rhythm.bpm)
        harmonic_ratios.append(g.harmonics.harmonic_ratio)
        reverb_estimates.append(g.reverb.reverb_estimate)
        decay_times.append(g.reverb.decay_time_estimate)

    return {
        "spectral": {
            "centroid_mean": float(np.mean(spectral_centroids)),
            "centroid_std": float(np.std(spectral_centroids)),
            "bandwidth_mean": float(np.mean(spectral_bandwidths)),
            "bandwidth_std": float(np.std(spectral_bandwidths)),
            "brightness_signature": "bright" if np.mean(spectral_centroids) > 2500 else "warm"
        },
        "dynamics": {
            "compression_mean": float(np.mean(dynamics_compressions)),
            "compression_std": float(np.std(dynamics_compressions)),
            "crest_factor_mean": float(np.mean(dynamics_crest_factors)),
            "compression_style": "heavy" if np.mean(dynamics_compressions) > 0.6 else "moderate" if np.mean(dynamics_compressions) > 0.3 else "light"
        },
        "frequency_balance": {
            "sub_bass_mean": float(np.mean(freq_sub_bass)),
            "bass_mean": float(np.mean(freq_bass)),
            "low_mid_mean": float(np.mean(freq_low_mid)),
            "mid_mean": float(np.mean(freq_mid)),
            "upper_mid_mean": float(np.mean(freq_upper_mid)),
            "presence_mean": float(np.mean(freq_presence)),
            "brilliance_mean": float(np.mean(freq_brilliance)),
            "signature_eq_curve": {
                "sub_bass_boost_db": round((np.mean(freq_sub_bass) - 0.05) * 24, 1),
                "bass_boost_db": round((np.mean(freq_bass) - 0.15) * 20, 1),
                "low_mid_boost_db": round((np.mean(freq_low_mid) - 0.10) * 18, 1),
                "mid_boost_db": round((np.mean(freq_mid) - 0.30) * 12, 1),
                "upper_mid_boost_db": round((np.mean(freq_upper_mid) - 0.15) * 15, 1),
                "presence_boost_db": round((np.mean(freq_presence) - 0.12) * 18, 1),
                "brilliance_boost_db": round((np.mean(freq_brilliance) - 0.13) * 15, 1)
            }
        },
        "stereo": {
            "width_mean": float(np.mean(stereo_widths)),
            "width_style": "wide" if np.mean(stereo_widths) > 0.5 else "moderate" if np.mean(stereo_widths) > 0.3 else "narrow"
        },
        "transients": {
            "attack_sharpness_mean": float(np.mean(transient_attacks)),
            "percussiveness_mean": float(np.mean(transient_percs)),
            "transient_style": "punchy" if np.mean(transient_attacks) > 3 else "smooth"
        },
        "tempo": {
            "bpm_mean": float(np.mean(tempos)),
            "bpm_std": float(np.std(tempos)),
            "bpm_range": [float(np.min(tempos)), float(np.max(tempos))]
        },
        "harmonics": {
            "harmonic_ratio_mean": float(np.mean(harmonic_ratios)),
            "style": "melodic" if np.mean(harmonic_ratios) > 0.6 else "rhythmic"
        },
        "reverb": {
            "reverb_mean": float(np.mean(reverb_estimates)),
            "decay_time_mean": float(np.mean(decay_times)),
            "spatial_style": "dry" if np.mean(reverb_estimates) < 0.3 else "ambient" if np.mean(reverb_estimates) < 0.6 else "wet"
        }
    }


def generate_ffmpeg_chain(aggregated: Dict[str, Any]) -> Dict[str, Any]:
    """Generate FFmpeg filter chain based on aggregated production signature"""

    eq_curve = aggregated.get("frequency_balance", {}).get("signature_eq_curve", {})
    dynamics = aggregated.get("dynamics", {})
    stereo = aggregated.get("stereo", {})
    transients = aggregated.get("transients", {})
    reverb = aggregated.get("reverb", {})

    # Build EQ chain
    eq_filters = []

    # Sub-bass (shelving)
    sub_bass_boost = eq_curve.get("sub_bass_boost_db", 0)
    if abs(sub_bass_boost) > 0.5:
        eq_filters.append(f"lowshelf=g={sub_bass_boost}:f=60:t=q:w=0.5")

    # Bass
    bass_boost = eq_curve.get("bass_boost_db", 0)
    if abs(bass_boost) > 0.5:
        eq_filters.append(f"equalizer=f=150:t=q:w=1:g={bass_boost}")

    # Low mids
    low_mid_boost = eq_curve.get("low_mid_boost_db", 0)
    if abs(low_mid_boost) > 0.5:
        eq_filters.append(f"equalizer=f=400:t=q:w=1.5:g={low_mid_boost}")

    # Mids
    mid_boost = eq_curve.get("mid_boost_db", 0)
    if abs(mid_boost) > 0.5:
        eq_filters.append(f"equalizer=f=1000:t=q:w=2:g={mid_boost}")

    # Upper mids (presence)
    upper_mid_boost = eq_curve.get("upper_mid_boost_db", 0)
    if abs(upper_mid_boost) > 0.5:
        eq_filters.append(f"equalizer=f=3000:t=q:w=1.5:g={upper_mid_boost}")

    # Presence
    presence_boost = eq_curve.get("presence_boost_db", 0)
    if abs(presence_boost) > 0.5:
        eq_filters.append(f"equalizer=f=5000:t=q:w=2:g={presence_boost}")

    # Brilliance (high shelf)
    brilliance_boost = eq_curve.get("brilliance_boost_db", 0)
    if abs(brilliance_boost) > 0.5:
        eq_filters.append(f"highshelf=g={brilliance_boost}:f=10000:t=q:w=0.707")

    # Compression settings
    compression_mean = dynamics.get("compression_mean", 0.5)
    if compression_mean > 0.6:
        # Heavy compression
        comp_filter = "acompressor=threshold=-12dB:ratio=6:attack=5:release=50:makeup=4"
    elif compression_mean > 0.3:
        # Moderate compression
        comp_filter = "acompressor=threshold=-18dB:ratio=4:attack=10:release=100:makeup=2"
    else:
        # Light compression
        comp_filter = "acompressor=threshold=-24dB:ratio=2:attack=20:release=200:makeup=1"

    # Stereo processing
    width = stereo.get("width_mean", 0.3)
    if width > 0.5:
        stereo_filter = "stereotools=mlev=1:slev=1.2:sbal=0"
    elif width > 0.3:
        stereo_filter = "stereotools=mlev=1:slev=1.05:sbal=0"
    else:
        stereo_filter = "stereotools=mlev=1:slev=1:sbal=0"

    # Reverb/spatial
    reverb_mean = reverb.get("reverb_mean", 0.3)
    decay = reverb.get("decay_time_mean", 0.3)
    if reverb_mean > 0.5:
        spatial_filter = f"aecho=0.8:0.7:{int(decay*100)}|{int(decay*200)}:0.4|0.3"
    elif reverb_mean > 0.3:
        spatial_filter = f"aecho=0.6:0.5:{int(decay*50)}:0.25"
    else:
        spatial_filter = None

    # Build complete chain
    chain_parts = ["highpass=f=30:poles=2"]  # Always start with rumble filter
    chain_parts.extend(eq_filters)
    chain_parts.append(comp_filter)
    chain_parts.append(stereo_filter)
    if spatial_filter:
        chain_parts.append(spatial_filter)
    chain_parts.append("loudnorm=I=-14:LRA=11:TP=-1")
    chain_parts.append("alimiter=limit=-1dB:level=false")

    return {
        "full_chain": ",".join(chain_parts),
        "eq_chain": ",".join(eq_filters) if eq_filters else "anull",
        "compression": comp_filter,
        "stereo": stereo_filter,
        "spatial": spatial_filter or "anull",
        "limiter": "alimiter=limit=-1dB:level=false",
        "description": {
            "eq_style": f"Custom Eminem EQ curve with bass boost and presence enhancement",
            "compression_style": dynamics.get("compression_style", "moderate"),
            "stereo_style": stereo.get("width_style", "moderate"),
            "reverb_style": reverb.get("spatial_style", "dry")
        }
    }


def dataclass_to_dict(obj):
    """Convert dataclass to dictionary recursively"""
    if hasattr(obj, '__dataclass_fields__'):
        return {k: dataclass_to_dict(v) for k, v in asdict(obj).items()}
    elif isinstance(obj, list):
        return [dataclass_to_dict(item) for item in obj]
    elif isinstance(obj, dict):
        return {k: dataclass_to_dict(v) for k, v in obj.items()}
    else:
        return obj


if __name__ == "__main__":
    # Test mode
    print("EMINEM GENOME ANALYZER - Test Mode")
    print("Use from reverse_engineer_eminem.sh for full analysis")
