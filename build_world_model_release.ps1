param(
  [string]$SourceDir = ".\sakacchi_world_model_v1.0",
  [string]$OutputZip = ".\sakacchi_world_model_v1.0.zip",
  [string]$LogFile = ".\sakacchi_world_model_v1.0\docs\RELEASE_LOG.txt"
)

# Resolve full paths
$src = Resolve-Path $SourceDir
$out = Resolve-Path -LiteralPath (Split-Path $OutputZip -Parent)
$outZipPath = Join-Path $out.Path (Split-Path $OutputZip -Leaf)

Write-Host "Source: $($src.Path)"
Write-Host "Output ZIP: $outZipPath"

if (-Not (Test-Path $src)) {
  Write-Host "❌ Source directory not found: $src"
  exit 1
}

if (Test-Path $outZipPath) { Remove-Item $outZipPath -Force }

# Create zip
Write-Host "🔧 Creating ZIP archive..."
Compress-Archive -Path "$($src.Path)\*" -DestinationPath $outZipPath -Force

# Log
$date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$entry = "[$date] Built $outZipPath`r`n"
if (-Not (Test-Path $LogFile)) {
  New-Item -ItemType File -Path $LogFile -Force | Out-Null
}
Add-Content -Path $LogFile -Value $entry

Write-Host "✅ ZIP created: $outZipPath"
Write-Host "📄 Log updated: $LogFile"
