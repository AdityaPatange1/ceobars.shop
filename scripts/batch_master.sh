#!/bin/bash
# Batch master all tracks

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

FILES=(
    "02100V2_TIM_WESTWOOD_NON_PROFIT_RAP_FREESTYLE.wav"
    "1KT1_FREESTYLE.wav"
    "BINDFOUR_FREESTYLE_ADI_55.wav"
    "CEO_BARS.wav"
    "CHATRILLIONAIRE_FREESTYLE_BROWN_AND_NERDY_ADI55.wav"
    "D_OFF_THE_BLOCK_FREESTYLE_ADI55.wav"
    "FOUR_THIRTY_FREESTYLE_ADI55.wav"
    "HIPPING_HOPPING_FREESTYLE_ADI55.wav"
    "KSHADGHESA_FREESTYLE.wav"
    "LA_KHOKA_NUSTA_ADI_55_FREESTYLE.wav"
    "MISSCOMESNET_FINAL.wav"
    "PEEK_330_FREESTYLE_ADI55.wav"
    "REALEST_FREESTYLE_ADI55_SHADYTHEME.wav"
    "RIDIN'_CLEAN_FREESTYLE_ADI55.wav"
    "SE7EN_FREESTYLE.wav"
    "TESLA_ROCKNASH_ADITYA_PATANGE.wav"
    "TOKYO_DRIFT_FREESTYLE_ADI55.wav"
    "Untitled.wav"
    "Z3T1_FREESTYLE_ADI55.wav"
    "ZENYUGA_V0_FREESTYLE_ADI55.wav"
)

total=${#FILES[@]}
count=0

for file in "${FILES[@]}"; do
    count=$((count + 1))
    echo ""
    echo "========================================"
    echo "Processing $count/$total: $file"
    echo "========================================"
    ./scripts/ceo_bars_mix_master.sh --fileName "$file"
done

echo ""
echo "========================================"
echo "BATCH MASTERING COMPLETE: $total tracks processed"
echo "========================================"
