Clear-Host;

$files = [System.Collections.ArrayList]@();
$skipped = [System.Collections.ArrayList]@();

$root = Get-Location;
Write-Host "Building image data: $root

";

if (!(Test-Path "./webapp/root_files/img")) {
    throw "This script needs to be run from the solution root folder.";
}

Set-Location "./webapp/root_files";
$path_prefix = Get-Location;

$file_types = @("jpg", "png", "svg", "gif", "jpeg", "ico");

Get-ChildItem "./img" -Recurse | ForEach-Object {
    $item_type = $_.GetType().Name.Trim();
    if ($item_type -eq "DirectoryInfo") {
        return;
    }
    $path = $_.FullName.Replace($path_prefix, "").Replace("\", "/");
    $name = $path.Split("/")[-1];
    $file_type = $name.Split(".")[-1].ToLower();
    $date = $_.CreationTime;
    if (!$file_types.Contains($file_type)) {
        if ($skipped.contains($file_type)) {
            return;
        }
        $skipped.Add($file_type);
        Write-Host "
Skipping unsupported file type $file_type ($item_type)
";
        return;
    }
    $item = @{name = $name; path = $path; type = $file_type; date = $date };
    $files.Add($item) | Out-Null
} | Out-Null

Get-ChildItem "./v" -Recurse | ForEach-Object {
    $item_type = $_.GetType().Name.Trim();
    if ($item_type -eq "DirectoryInfo") {
        return;
    }
    $path = $_.FullName.Replace($path_prefix, "").Replace("\", "/");
    $name = $path.Split("/")[-1];
    $file_type = $name.Split(".")[-1].ToLower();
    $date = $_.CreationTime;
    if (!$file_types.Contains($file_type)) {
        if ($skipped.contains($file_type)) {
            return;
        }
        $skipped.Add($file_type);
        Write-Host "
Skipping unsupported file type $file_type ($item_type)
";
        return;
    }
    $item = @{name = $name; path = $path; type = $file_type; date = $date };
    $files.Add($item) | Out-Null
} | Out-Null

function BuildImageData {
    begin {
        '['
    }

    process {
        '  {'
        "    ""file_name"":""$($_.name)"",
",
        "   ""file_path"":""$($_.path)"",
",
        "   ""file_type"":""$($_.type)"",
",
        "   ""updated"":""{0:yyyy-MM-dd}""" -f $_.date
        '  },'
    }

    end {
        "]"
    }
}

$json = $files | BuildImageData | Out-String

$json = $json.Substring(0, $json.LastIndexOf(',')) + $json.Substring($json.LastIndexOf(',') + 1);

$json | Out-File imagedata.json -Encoding ascii

Set-Location $root;
