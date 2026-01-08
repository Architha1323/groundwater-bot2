<#
Simple PowerShell dev script for starting/stopping the server.
Usage: .\scripts\dev.ps1 start|stop|status|open

- start: starts nodemon (if installed) or node and writes PID to .dev.pid
- stop: stops process using PID in .dev.pid
- status: prints PID and process info
- open: opens http://localhost:$PORT in default browser
#>
param(
    [Parameter(Position=0)]
    [ValidateSet('start','stop','status','open')]
    [string]$Action = 'start'
)

$PORT = if ($env:PORT) { $env:PORT } else { 3000 }
$PIDFile = Join-Path $PSScriptRoot '..\.dev.pid'

function Get-RunningPid {
    if (Test-Path $PIDFile) {
        try {
            $pid = Get-Content $PIDFile | Select-Object -First 1
            if ($pid -and (Get-Process -Id $pid -ErrorAction SilentlyContinue)) {
                return [int]$pid
            }
        } catch { }
    }
    return $null
}

function Save-Pid($p) {
    $p.Id | Out-File -FilePath $PIDFile -Encoding ascii
}

switch ($Action) {
    'start' {
        $existing = Get-RunningPid
        if ($existing) { Write-Output "Server already running (PID $existing). Use `stop` to stop it.`"; break }

        # prefer local nodemon if available
        $nodemonPath = Join-Path $PSScriptRoot '..\node_modules\.bin\nodemon.cmd'
        if (Test-Path $nodemonPath) {
            $proc = Start-Process -FilePath $nodemonPath -ArgumentList 'server.js' -PassThru
        } else {
            $proc = Start-Process -FilePath node -ArgumentList 'server.js' -PassThru
        }
        Start-Sleep -Seconds 1
        if ($proc -and (Get-Process -Id $proc.Id -ErrorAction SilentlyContinue)) {
            Save-Pid $proc
            Write-Output "Started server (PID $($proc.Id)) on port $PORT"
        } else {
            Write-Error "Failed to start server"
        }
    }
    'stop' {
        $pid = Get-RunningPid
        if (-not $pid) { Write-Output 'No running server found.'; break }
        try {
            Stop-Process -Id $pid -Force -ErrorAction Stop
            Remove-Item $PIDFile -ErrorAction SilentlyContinue
            Write-Output "Stopped server (PID $pid)"
        } catch {
            Write-Error "Failed to stop PID $pid: $_"
        }
    }
    'status' {
        $pid = Get-RunningPid
        if ($pid) {
            Get-Process -Id $pid | Select-Object Id,ProcessName,StartTime,CPU | Format-List
        } else {
            Write-Output 'No running server found.'
        }
    }
    'open' {
        $url = "http://localhost:$PORT"
        Start-Process $url
        Write-Output "Opened $url"
    }
}
