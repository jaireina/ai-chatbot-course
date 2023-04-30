<script setup lang="ts">
import { Message, User } from "~~/types";

const me = ref<User>({
  id: "user",
  avatar: "/avatar.jpg",
  name: "You",
});
const bot = ref<User>({
  id: "assistant",
  avatar: "/bot.jpg",
  name: "Botman",
});

const users = computed(() => [me.value, bot.value]);

const messages = ref<Message[]>([]);

const usersTyping = ref<User[]>([]);

const messagesForApi = computed(() => {
  return messages.value.map((message) => ({
    role: message.userId,
    content: message.text,
  }));
});

// send messages to Chat API here
async function handleNewMessage(message: Message) {
  messages.value.push(message);
  usersTyping.value.push(bot.value);
  const res = await $fetch("/api/ai", {
    method: "POST",
    body: {
      messages: messagesForApi.value,
    },
  });

  console.log(res);

  if (!res.choices[0]?.message?.content) {
    return;
  }

  const msg: Message = {
    id: res.id,
    userId: bot.value.id,
    text: res.choices[0]?.message?.content,
    createdAt: new Date(),
  };

  messages.value.push(msg);
  usersTyping.value = [];
}
</script>
<template>
  <ChatBox
    :me="me"
    :users="users"
    :messages="messages"
    @new-message="handleNewMessage"
    :usersTyping="usersTyping"
  />
</template>
