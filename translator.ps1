$sourcePath = "c:\Users\maram\CRMEB\crmeb\app\lang\en_us.php"
$destPath = "c:\Users\maram\CRMEB\crmeb\app\lang\ar.php"
$lines = Get-Content -Path $sourcePath -Encoding UTF8

$output = @()
$count = 0
$total = 0

# Count total to translate
foreach ($line in $lines) {
    if ($line -match "^(\s*'.*?'\s*=>\s*')([^']+)('.*,?\s*)$") {
        $total++
    }
}

Write-Host "Starting translation of $total items..."

foreach ($line in $lines) {
    if ($line -match "^(\s*'.*?'\s*=>\s*')([^']+)('.*,?\s*)$") {
        $prefix = $matches[1]
        $textToTranslate = $matches[2]
        $suffix = $matches[3]
        
        # skip if already translated or pure numbers/symbols
        if ($textToTranslate -match "^[0-9\s]+$") {
            $output += $line
            continue
        }

        $url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=" + [uri]::EscapeDataString($textToTranslate)
        try {
            $response = Invoke-RestMethod -Uri $url -Method Get -ErrorAction Stop
            $translatedText = $response[0][0][0]
            # Escape single quotes for PHP
            $translatedText = $translatedText -replace "'","\'"
            
            $output += "$prefix$translatedText$suffix"
            $count++
            if ($count % 20 -eq 0) {
                Write-Host "Translated $count / $total items..."
                # prevent spam block
                $output | Set-Content -Path $destPath -Encoding UTF8
            }
            Start-Sleep -Milliseconds 80
        } catch {
            Write-Host "Failed to translate: $textToTranslate. Fallback to English."
            $output += $line
            Start-Sleep -Seconds 1
        }
    } else {
        $output += $line
    }
}

$output | Set-Content -Path $destPath -Encoding UTF8
Write-Host "Translation completed! All $count terms translated to Arabic and saved to $destPath"
