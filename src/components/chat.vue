<template>
  <div class="chat-container">
    <div v-if="!isConnected" class="login-container">
      <input v-model="pseudo" placeholder="Pseudo..." class="input-field" />
      <input v-model="roomId" placeholder="Channel..." class="input-field" />
      <button @click="connectToChat" class="connect-button">
        Se connecter
      </button>
    </div>

    <div v-else>
      <div class="settings-container">
        <input v-model="pseudo" placeholder="Pseudo..." class="input-field" />
        <input v-model="roomId" placeholder="Channel..." class="input-field" />
        <button @click="updateRoom" class="update-button">
          Changer de salon
        </button>
      </div>

      <div class="messages" ref="messagesContainer">
        <div v-for="msg in filteredMessages" :key="msg.dateEmis" :class="['message', msg.pseudo === pseudo ? 'user' : 'other']">
          <div class="message-info">
            <span class="author">{{ msg.pseudo }}</span>
            <span class="date">{{ formatDate(msg.dateEmis) }}</span>
          </div>
          <div class="content">{{ msg.content }}</div>
        </div>
      </div>

      <div class="input-container">
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Écrire un message..." class="message-input" />
        <button @click="sendMessage" class="send-button">Envoyer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { io } from "socket.io-client";

const messages = ref([]);
const roomId = ref("general");
const pseudo = ref("");
const isConnected = ref(false);
const socket = ref(null);
const newMessage = ref("");
const messagesContainer = ref(null);

const formatDate = (dateString) => new Date(dateString).toLocaleTimeString();

const filteredMessages = computed(() => messages.value);

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const connectToChat = () => {
  if (!pseudo.value || !roomId.value) return;

  socket.value = io("https://mohammedelmehdi.makhlouk.angers.mds-project.fr", {
    transports: ["websocket"],
  });
  socket.value.emit("chat-join-room", { pseudo: pseudo.value, roomId: roomId.value });

  socket.value.on("chat-msg", (msg) => {
    messages.value.push(msg);
    scrollToBottom();
  });

  isConnected.value = true;
};

const sendMessage = () => {
  if (!newMessage.value.trim()) return;

  const messageData = {
    content: newMessage.value,
    roomId: roomId.value,
  };
  socket.value.emit("chat-msg", messageData);
  newMessage.value = "";
};

const updateRoom = () => {
  if (socket.value) {
    socket.value.emit("chat-join-room", { pseudo: pseudo.value, roomId: roomId.value });
    messages.value = [];
  }
};
</script>

<style scoped>
.chat-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50%;
  background: black;
}

.chat-card {
  width: 75%;
  background: #000;
  border: 2px solid #024d64;
  border-radius: 20px;
  padding: 20px;
}

.login-container,
.settings-container {
  text-align: center;
}

.input-field {
  width: 25%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #024d64;
  font-size: 16px;
  background: black;
  color: white;
  text-align: center;
}

.connect-button,
.update-button {
  background-color: #024d64;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 20px;
}

.update-button {
  background-color: #b06905;
}

.messages {
  max-height: 60vh;
  overflow-y: auto;
  padding: 10px;
  background: black;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-bottom: 20px;
}

.message {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 18px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  word-wrap: break-word;
  font-size: 14px;
  position: relative;
}

.message-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.author {
  font-weight: bold;
}

.date {
  font-style: italic;
  font-size: 11px;
  margin-left: 10px;
}

.content {
  margin-top: 5px;
  font-size: 14px;
}

.user {
  background-color: #b06905;
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 5px;
}

.system {
  background-color: #b06905;
  color: black;
  text-align: center;
  font-weight: bold;
  align-self: center;
  max-width: 90%;
}

.other {
  background-color: #024d64;
  color: white;
  align-self: flex-start;
  border-bottom-left-radius: 5px;
}

.input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-top: 10px;
}

.message-input {
  width: 60%;
  max-width: 400px;
  padding: 12px;
  border-radius: 25px;
  text-align: center;
  font-size: 16px;
  outline: none;
  background: black;
  color: white;
  border: 1px solid #024d64;
}

.send-button {
  background-color: #024d64;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 12px 20px;
  cursor: pointer;
}

.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: white;
  accent-color: #b06905;
}

.checkbox-label input {
  margin-right: 5px;
}
</style>
