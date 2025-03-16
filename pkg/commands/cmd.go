package dccommands

import (
	"fmt"

	"github.com/bwmarrin/discordgo"
)


func RegisterCommands(s *discordgo.Session, commands []*discordgo.ApplicationCommand) {
	for _, cmd := range commands {
		_, err := s.ApplicationCommandCreate(s.State.User.ID, "", cmd)
		if err != nil {
			fmt.Printf("Erro ao registrar comando %s: %v\n", cmd.Name, err)
		} else {
			fmt.Printf("Comando registrado: /%s\n", cmd.Name)
		}
	}
}

func RemoveCommands(s *discordgo.Session) {
	commands, err := s.ApplicationCommands(s.State.User.ID, "")
	if err != nil {
		fmt.Println("Erro ao obter comandos registrados:", err)
		return
	}

	for _, cmd := range commands {
		err := s.ApplicationCommandDelete(s.State.User.ID, "", cmd.ID)
		if err != nil {
			fmt.Printf("Erro ao remover comando %s: %v\n", cmd.Name, err)
		} else {
			fmt.Printf("Comando removido: /%s\n", cmd.Name)
		}
	}
}