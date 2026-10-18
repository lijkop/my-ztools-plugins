$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$dist = Join-Path $root "dist"
$stage = Join-Path $dist "stage\flashlaunch"
$zip = Join-Path $dist "flashlaunch-1.0.0.zip"

if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory -Force -Path (Join-Path $stage "assets"), (Join-Path $stage "utils") | Out-Null

Copy-Item (Join-Path $root "plugin.json") $stage
Copy-Item (Join-Path $root "index.html") $stage
Copy-Item (Join-Path $root "preload.js") $stage
Copy-Item (Join-Path $root "logo.png") $stage
Copy-Item (Join-Path $root "README.md") $stage
Copy-Item (Join-Path $root "CHANGELOG.md") $stage
Copy-Item (Join-Path $root "assets\app.js") (Join-Path $stage "assets")
Copy-Item (Join-Path $root "assets\styles.css") (Join-Path $stage "assets")
Copy-Item (Join-Path $root "assets\dev-mock.js") (Join-Path $stage "assets")
Copy-Item (Join-Path $root "utils\args.js") (Join-Path $stage "utils")

if (Test-Path $zip) { Remove-Item $zip -Force }
Add-Type -AssemblyName System.IO.Compression.FileSystem
# 用 .NET 打包，保证 zip 内路径是正斜杠（AdmZip 解压更稳）
[System.IO.Compression.ZipFile]::CreateFromDirectory($stage, $zip)
Remove-Item (Join-Path $dist "stage") -Recurse -Force

Write-Output "packed: $zip"
Get-Item $zip | Select-Object FullName, Length
