package main

import (
	"fmt"
	"os"
	"os/signal"
	"strings"
	"syscall"

	"github.com/bwmarrin/discordgo"
	"github.com/joho/godotenv"
)

var voiceConnections = make(map[string]*discordgo.VoiceConnection)

func main() {
	erro := godotenv.Load()

	if erro != nil {
		fmt.Println("Erro ao carregar variáveis de ambiente,", erro)
	}

	token := os.Getenv("BOT_TOKEN");
	
	if token == "" {
		fmt.Println("O token do bot não foi encontrado!")
		return
	}

	dg, err := discordgo.New("Bot " + strings.TrimSpace(token))

	if err != nil {
		fmt.Println("Erro ao criar sessão do Discord,", err)
		return
	}

	dg.AddHandler(handleMessage)
	dg.AddHandler(userJoin)
	dg.AddHandler(reactionAdded)
	dg.AddHandler(quitVoiceChannel)

	err = dg.Open()
    if err != nil {
        fmt.Println("Erro ao conectar com o Discord,", err)
        return
    }

    fmt.Println("Bot está rodando. Pressione CTRL+C para encerrar.")

    // Aguarde até que o bot seja encerrado
    stop := make(chan os.Signal, 1)
    signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
    <-stop

    // Fecha a conexão
    dg.Close()
}

/* Sempre que uma mensagem for enviada ao servidor, essa função será chamada */
func handleMessage(s *discordgo.Session, m *discordgo.MessageCreate) {
	if m.Author.ID == s.State.User.ID {
		return
	}
	switch {
		case strings.HasPrefix(m.Content, "!ping"):
			s.ChannelMessageSend(m.ChannelID, "Pong!")
		case strings.HasPrefix(m.Content, "!play"):
			findVoiceChannel(s, m)
	}
}

func userJoin (s *discordgo.Session, m *discordgo.GuildMemberAdd) {
	s.ChannelMessageSend(m.GuildID, fmt.Sprintf("Bem-vindo, %s!", m.User.Username))
}

func reactionAdded(_ *discordgo.Session, r *discordgo.MessageReactionAdd) {
	fmt.Printf("Reação %s adicionada na mensagem %s por %s\n", r.Emoji.Name, r.MessageID, r.UserID)
}

func quitVoiceChannel(s *discordgo.Session, data *discordgo.VoiceStateUpdate) {
	user, err := s.User(data.UserID)
	if err != nil {
		fmt.Println("Erro ao obter usuário,", err)
	}

	if data.ChannelID == "" {
		channels := listGuildChannels(s, data.GuildID)
		if channels == nil {
			return
		}
		
		for _, ch := range channels {
			if strings.Contains(strings.ToLower(ch.Name), "comandos") {
				s.ChannelMessageSend(ch.ID, fmt.Sprintf("@%s saiu da call!", user.Username))
				break
			}
		}
		
		return
	}
}

func listGuildChannels(s *discordgo.Session, guildID string) []*discordgo.Channel {
	channels, err := s.GuildChannels(guildID)
	if err != nil {
		return nil
	}
	return channels
}

func findVoiceChannel(s *discordgo.Session, m *discordgo.MessageCreate) {
	guild, err := s.State.Guild(m.GuildID)
	if err != nil {
		fmt.Println("Erro ao obter guild:", err)
		return
	}

	// Descobre em qual canal de voz o usuário está
	var voiceChannelID string
	for _, vs := range guild.VoiceStates {
		if vs.UserID == m.Author.ID {
			voiceChannelID = vs.ChannelID
			break
		}
	}

	if voiceChannelID == "" {
		s.ChannelMessageSend(m.ChannelID, "Você não está em nenhum canal de voz!")
		return
	}

	voiceChannel, err := s.Channel(voiceChannelID)
	if err != nil {
		fmt.Println("Erro ao obter canal de voz:", err)
		return
	}
	vc, err := s.ChannelVoiceJoin(m.GuildID, voiceChannelID, true, true)

	if err != nil {
		fmt.Println("Erro ao entrar no canal de voz!")
		return
	}

	voiceConnections[voiceChannelID] = vc
	response := fmt.Sprintf("Você está no canal de voz: **%s**", voiceChannel.Name)
	s.ChannelMessageSend(m.ChannelID, response)
	
}

/* 
	type MessageCreate struct {
    	Informações sobre a mensagem
		ID                string
		ChannelID         string
		GuildID           string
		Author            *User
		Content           string
		Timestamp         time.Time
		EditedTimestamp   *time.Time
		IsTTS             bool
		Mentions          []*User
		MentionsEveryone  bool
		MentionsRoles     []*Role
		Attachments       []*Attachment
		Embeds            []*Embed
		Reactions         []*Reaction
		Nonce             string
		MentionedChannels []*Channel
		Type              MessageType
		Flags             MessageFlags
}
*/