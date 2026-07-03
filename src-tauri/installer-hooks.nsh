; "Open in NovaTerm" shell verbs for folders, folder backgrounds, and drives.
; HKCU matches installer currentUser scope. %V = clicked path.
; NoWorkingDirectory keeps Explorer from overriding %V (System32 on Drive).

!macro NSIS_HOOK_POSTINSTALL
  WriteRegStr HKCU "Software\Classes\Directory\shell\OpenInNovaTerm" "" "Open in NovaTerm"
  WriteRegStr HKCU "Software\Classes\Directory\shell\OpenInNovaTerm" "Icon" '"$INSTDIR\novaterm.exe",0'
  WriteRegStr HKCU "Software\Classes\Directory\shell\OpenInNovaTerm" "NoWorkingDirectory" ""
  WriteRegStr HKCU "Software\Classes\Directory\shell\OpenInNovaTerm\command" "" '"$INSTDIR\novaterm.exe" "%V"'

  WriteRegStr HKCU "Software\Classes\Directory\Background\shell\OpenInNovaTerm" "" "Open in NovaTerm"
  WriteRegStr HKCU "Software\Classes\Directory\Background\shell\OpenInNovaTerm" "Icon" '"$INSTDIR\novaterm.exe",0'
  WriteRegStr HKCU "Software\Classes\Directory\Background\shell\OpenInNovaTerm" "NoWorkingDirectory" ""
  WriteRegStr HKCU "Software\Classes\Directory\Background\shell\OpenInNovaTerm\command" "" '"$INSTDIR\novaterm.exe" "%V"'

  WriteRegStr HKCU "Software\Classes\Drive\shell\OpenInNovaTerm" "" "Open in NovaTerm"
  WriteRegStr HKCU "Software\Classes\Drive\shell\OpenInNovaTerm" "Icon" '"$INSTDIR\novaterm.exe",0'
  WriteRegStr HKCU "Software\Classes\Drive\shell\OpenInNovaTerm" "NoWorkingDirectory" ""
  WriteRegStr HKCU "Software\Classes\Drive\shell\OpenInNovaTerm\command" "" '"$INSTDIR\novaterm.exe" "%V"'
!macroend

!macro NSIS_HOOK_POSTUNINSTALL
  DeleteRegKey HKCU "Software\Classes\Directory\shell\OpenInNovaTerm"
  DeleteRegKey HKCU "Software\Classes\Directory\Background\shell\OpenInNovaTerm"
  DeleteRegKey HKCU "Software\Classes\Drive\shell\OpenInNovaTerm"
!macroend
