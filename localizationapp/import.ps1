
param(
    [string] $appname,
    [string] $distLocation,
    [string] $solutionUniqueName,
    [string] $organizationName
)

function Login
{
    $connection = Get-CrmConnection -OrganizationName $organizationName -OnLineType Office365 -Credential $cred;
    Write-Host "Connected to organization $($organizationName)";
    return $connection;
}

function Upsert
{

   param([Microsoft.Xrm.Sdk.Entity] $entity)

   $upsertRequest = [Microsoft.Xrm.Sdk.Messages.UpsertRequest]::new();
   $upsertRequest.Target = $entity;
   $upsertRequest.Parameters.Add("SolutionUniqueName", $solutionUniqueName);

   $response = [Microsoft.Xrm.Sdk.Messages.UpsertResponse]$CrmConnection.Execute($upsertRequest);
   return $response;
}

function Publish
{
   param([Guid] $entityId)

   $publishRequest = [Microsoft.Crm.Sdk.Messages.PublishXmlRequest]::new();
   $publishRequest.ParameterXml = "<importexportxml><webresources><webresource>$($entityId)</webresource></webresources></importexportxml>";

   $CrmConnection.Execute($publishRequest);
}

function Get-WebResource
{
    param([string] $name,
          [string] $content,
          [Guid]   $id);

    $type = Get-WebResourceType -webresourceName $name;

    $entity = [Microsoft.Xrm.Sdk.Entity]::new();
    $entity.Id = $id;
    $entity.LogicalName = "webresource";
    $entity.Attributes["description"] = "Web Resource for Angular App $($appname)";
    $entity.Attributes["displayname"] = $name;
    $entity.Attributes["languagecode"] = 1033;
    $entity.Attributes["content"] = $content;
    $entity.Attributes["name"] = Get-WebresourceName -fileName $name;
    $entity.Attributes["webresourcetype"] = [Microsoft.Xrm.Sdk.OptionSetValue]::new([int]$type);

    return $entity;
}

function Get-Id
{
    param ([string]$value);

    $md5 = [System.Security.Cryptography.MD5]::Create();
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($value);
    $hash = $md5.ComputeHash($bytes);
    return [System.Guid]::new($hash);
}

function Get-WebResourceName
{
    param ([string] $fileName)

    $webResourceName = "$($EntityPrefix)/$($appname)/$($nameExt)";
    return $webResourceName;
}

function Get-FileContent
{
    param([string] $path)

    $bytes = [System.IO.File]::ReadAllBytes($path);
    return [System.Convert]::ToBase64String($bytes);
}

function Get-FilePaths
{
    $files = Get-Item "$($distLocation)/*";
    Write-Host "Got $($files.Count) files:";
    foreach ($file in $files)
    {
        $fileName = [System.IO.Path]::GetFileName($file);
        Write-Host $fileName;
    }
    return $files;
}

function Get-WebResourceType
{
    param ([string] $webresourceName);

    $parts = $webresourceName.Split('.');
    $ext = $parts[$parts.Length-1].ToLower();

    $type = $null;
    switch($ext)
    {
        "js"   {$type = [WebResourceType]::ScriptJScript; break}
        "html" {$type = [WebResourceType]::WebpageHTML; break}
        "ico"  {$type = [WebResourceType]::ICOformat; break}
        "css"  {$type = [WebResourceType]::StyleSheetCSS; break}
    }

    return $type;
}

enum WebResourceType
{
     WebpageHTML = 1;
     StyleSheetCSS = 2;
     ScriptJScript = 3;
     DataXML = 4;
     PNGformat = 5;
     JPGformat = 6;
     GIFformat = 7;
     SilverlightXAP = 8;
     StyleSheetXSL = 9;
     ICOformat = 10;
     VectorformatSVG = 11;
     StringRESX = 12;
}

$EntityPrefix = "sb_";

$CrmConnection = Login;
$filePaths = Get-FilePaths;

foreach ($file in $filePaths)
{
    $content = Get-FileContent -path $file;
    $nameExt = [System.IO.Path]::GetFileName($file);
    $resourceName = Get-WebResourceName -fileName $nameExt;
    $id = Get-Id -value $resourceName;

    $entity = Get-WebResource -name $nameExt -content $content -id $id;
    $result = Upsert -entity $entity;
    Write-Host "Upsert result: IsCreated=$($result.RecordCreated) for $($nameExt):$($id)";
    Publish -entityId $entity.Id;

    Write-Host "Imported $($nameExt)";
}

Write-Host "Import executed!";
