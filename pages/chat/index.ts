import { askPRD } from '../../services/api';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    title: string;
    url: string;
  }>;
}

Page({
  data: {
    messages: [] as Message[],
    inputValue: '',
    loading: false,
    scrollToView: '',
  },

  onInput(e: { detail: { value: string } }) {
    this.setData({ inputValue: e.detail.value });
  },

  async onSend() {
    const query = this.data.inputValue.trim();
    if (!query || this.data.loading) return;

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: query,
    };

    this.setData({
      messages: [...this.data.messages, userMessage],
      inputValue: '',
      loading: true,
      scrollToView: 'scroll-bottom',
    });

    try {
      // 调用 API
      const result = await askPRD(query);

      // 添加助手消息
      const assistantMessage: Message = {
        id: Date.now(),
        role: 'assistant',
        content: result.answer,
        sources: result.sources?.slice(0, 3).map((s) => ({
          title: s.title,
          url: s.url,
        })),
      };

      this.setData({
        messages: [...this.data.messages, assistantMessage],
        scrollToView: 'scroll-bottom',
      });
    } catch (error) {
      console.error('API call failed:', error);

      // 添加错误消息
      const errorMessage: Message = {
        id: Date.now(),
        role: 'assistant',
        content: '抱歉，查询失败了，请稍后重试。',
      };

      this.setData({
        messages: [...this.data.messages, errorMessage],
        scrollToView: 'scroll-bottom',
      });
    } finally {
      this.setData({ loading: false });
    }
  },
});
