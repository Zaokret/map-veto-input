export function createMessageNotification(message) {
    return { type: 'message', message };
}
  
export function createPromptMessage(message) {
    return { type: 'prompt', message };
}
  