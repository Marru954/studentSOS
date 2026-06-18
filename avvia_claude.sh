#!/bin/bash

SESSION="claude_dev"
DIR="$HOME/Documents/Sito Università"

# Controlla se la sessione esiste già
tmux has-session -t $SESSION 2>/dev/null

if [ $? != 0 ]; then
    # 1. Crea una nuova sessione in background nel Riquadro 0 (alto-sinistra)
    tmux new-session -d -s $SESSION -c "$DIR"
    tmux send-keys -t $SESSION 'claude' C-m

    # 2. Dividi a metà verticalmente (crea Riquadro 1 a destra)
    tmux split-window -h -t $SESSION -c "$DIR"
    tmux send-keys -t $SESSION 'claude' C-m

    # 3. Torna a sinistra (0) e dividi orizzontalmente
    tmux select-pane -t $SESSION:0.0
    tmux split-window -v -t $SESSION -c "$DIR"
    tmux send-keys -t $SESSION 'claude' C-m

    # 4. Vai a destra (che ora è diventato il riquadro 2) e dividi orizzontalmente
    tmux select-pane -t $SESSION:0.2
    tmux split-window -v -t $SESSION -c "$DIR"
    tmux send-keys -t $SESSION 'claude' C-m
fi

# Entra nella sessione pronta
tmux attach-session -t $SESSION
