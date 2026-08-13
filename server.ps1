# PowerShell TCP Web Server (Listens on 0.0.0.0:8080)
$port = 8080
$rootDir = $PSScriptRoot
if (-not $rootDir) { $rootDir = (Get-Location).ProviderPath }

$listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $port)
$listener.Start()
Write-Host "TCP Web Server successfully running on port $port serving $rootDir"

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".jpg"  = "image/jpeg"
    ".png"  = "image/png"
}

while ($true) {
    try {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
        
        $requestLine = $reader.ReadLine()
        if (-not $requestLine) { $client.Close(); continue }
        
        if (-not ($requestLine.StartsWith("GET") -or $requestLine.StartsWith("POST") -or $requestLine.StartsWith("HEAD"))) {
            $client.Close()
            continue
        }
        
        $tokens = $requestLine.Split(' ')
        if ($tokens.Length -lt 2) { $client.Close(); continue }
        
        $rawUrl = [System.Uri]::UnescapeDataString($tokens[1])
        $cleanPath = $rawUrl.Split('?')[0]
        if ($cleanPath -eq "/" -or $cleanPath -eq "") { $cleanPath = "/index.html" }
        
        # Drain headers
        while (($line = $reader.ReadLine()) -and ($line.Trim() -ne "")) {}
        
        $rel = $cleanPath.TrimStart('/').Replace('/', '\')
        $filePath = Join-Path -Path $rootDir -ChildPath $rel
        
        if (Test-Path -LiteralPath $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = $mimeTypes[$ext]
            if (-not $contentType) { $contentType = "application/octet-stream" }
            
            $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
            $header = "HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $($fileBytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
            
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($fileBytes, 0, $fileBytes.Length)
        } else {
            $notFound = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: 13`r`nConnection: close`r`n`r`n404 Not Found"
            $notFoundBytes = [System.Text.Encoding]::ASCII.GetBytes($notFound)
            $stream.Write($notFoundBytes, 0, $notFoundBytes.Length)
        }
        
        $stream.Flush()
        $client.Close()
    } catch {
        # Continue loop on error
    }
}
