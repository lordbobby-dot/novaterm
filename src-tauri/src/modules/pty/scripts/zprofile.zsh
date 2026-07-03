# novaterm-shell-integration (zprofile)
#
# See zshenv.zsh for the rationale on the trailing `:`.
{
  _novaterm_user_zdotdir="${NOVATERM_USER_ZDOTDIR:-$HOME}"
  [ -f "$_novaterm_user_zdotdir/.zprofile" ] && source "$_novaterm_user_zdotdir/.zprofile"
  unset _novaterm_user_zdotdir
}
:
