---
description: ப்ராஜெக்ட் பேக்கப் செய்தல் / Project Backup Workflow
---

1. ஒரு புதிய காலமுத்திரையுடன் (Timestamp) `E:\Project_Backups` டிரைவில் ஒரு புதிய ஃபோல்டரை உருவாக்கவும்.
// turbo
2. தற்போதைய ப்ராஜெக்ட் (`c:\Users\MATHAN\2026-SPECIAL-EXAM`) கோப்புகளை `robocopy` மூலமாக புதிய ஃபோல்டருக்கு நகல் எடுக்கவும்.

```powershell
$timestamp = (Get-Date).ToString("yyyyMMdd_HHmm"); 
$dest = "E:\Project_Backups\Backup_$timestamp"; 
New-Item -ItemType Directory -Force -Path $dest; 
robocopy "c:\Users\MATHAN\2026-SPECIAL-EXAM" $dest /E /Z /R:2 /W:5 /XD .git .next node_modules
```
