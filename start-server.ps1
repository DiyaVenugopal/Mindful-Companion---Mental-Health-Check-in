# Simple HTTP Server for Mindful Companion
# Run this script to start a local server

$port = 8000
$path = Get-Location

Write-Host "Starting server on http://localhost:$port" -ForegroundColor Green
Write-Host "Serving files from: $path" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
Write-Host ""

# Create a simple HTTP listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Server is running! Open http://localhost:$port in your browser" -ForegroundColor Green
Write-Host ""

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    $localPath = $request.Url.LocalPath
    if ($localPath -eq "/") {
        $localPath = "/index.html"
    }
    
    $filePath = Join-Path $path $localPath.TrimStart('/')
    
    if (Test-Path $filePath -PathType Leaf) {
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $extension = [System.IO.Path]::GetExtension($filePath)
        
        # Set content type
        switch ($extension) {
            ".html" { $contentType = "text/html; charset=utf-8" }
            ".css" { $contentType = "text/css; charset=utf-8" }
            ".js" { $contentType = "application/javascript; charset=utf-8" }
            ".json" { $contentType = "application/json; charset=utf-8" }
            ".png" { $contentType = "image/png" }
            ".jpg" { $contentType = "image/jpeg" }
            ".jpeg" { $contentType = "image/jpeg" }
            ".svg" { $contentType = "image/svg+xml" }
            default { $contentType = "application/octet-stream" }
        }
        
        $response.ContentType = $contentType
        $response.ContentLength64 = $content.Length
        $response.StatusCode = 200
        $response.OutputStream.Write($content, 0, $content.Length)
    } else {
        $response.StatusCode = 404
        $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found")
        $response.ContentLength64 = $notFound.Length
        $response.OutputStream.Write($notFound, 0, $notFound.Length)
    }
    
    $response.Close()
}

$listener.Stop()
