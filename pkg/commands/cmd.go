package dccommands

import (
	"fmt"

	"github.com/bwmarrin/discordgo"
)

func RegisterCommands(s *discordgo.Session, commands []*discordgo.ApplicationCommand) {
	// Registra os comandos, mas apenas se eles não estiverem registrados
	for _, cmd := range commands {
		// Verifica se o comando já existe
		existingCmds, err := s.ApplicationCommands(s.State.User.ID, "")
		if err != nil {
			fmt.Println("Erro ao buscar comandos existentes:", err)
			return
		}

		// Verifica se o comando já existe
		commandExists := false
		for _, existingCmd := range existingCmds {
			if existingCmd.Name == cmd.Name {
				commandExists = true
				break
			}
		}

		if !commandExists {
			// Se o comando não existe, adiciona
			_, err := s.ApplicationCommandCreate(s.State.User.ID, "", cmd)
			if err != nil {
				fmt.Println("Erro ao registrar comando:", cmd.Name, err)
			} else {
				fmt.Println("Comando registrado:", cmd.Name)
			}
		} else {
			fmt.Println("Comando já existe:", cmd.Name)
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