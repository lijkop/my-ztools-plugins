Add-Type -AssemblyName System.Drawing

$size = 256
$bmp = New-Object System.Drawing.Bitmap($size, $size)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::Transparent)

# 圆角矩形
$rect = New-Object System.Drawing.Rectangle(10, 10, 236, 236)
$r = 58
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddArc($rect.X, $rect.Y, $r, $r, 180, 90)
$path.AddArc($rect.Right - $r, $rect.Y, $r, $r, 270, 90)
$path.AddArc($rect.Right - $r, $rect.Bottom - $r, $r, $r, 0, 90)
$path.AddArc($rect.X, $rect.Bottom - $r, $r, $r, 90, 90)
$path.CloseFigure()

$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  $rect,
  [System.Drawing.Color]::FromArgb(255, 99, 102, 241),
  [System.Drawing.Color]::FromArgb(255, 6, 182, 212),
  45.0
)
$g.FillPath($brush, $path)

# 高光
$glow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(38, 255, 255, 255))
$g.FillEllipse($glow, 18, -60, 220, 180)

# 闪电
$points = @(
  (New-Object System.Drawing.Point(148, 34)),
  (New-Object System.Drawing.Point(88, 142)),
  (New-Object System.Drawing.Point(124, 142)),
  (New-Object System.Drawing.Point(108, 224)),
  (New-Object System.Drawing.Point(172, 108)),
  (New-Object System.Drawing.Point(134, 108))
)
$g.FillPolygon([System.Drawing.Brushes]::White, $points)

$out = Join-Path $PSScriptRoot "..\logo.png"
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Output "saved: $out"
