export const handleError = (error: unknown) => {
    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as { response?: { data?: { message?: string } } }).response;
      if (response?.data?.message) {
        return { message: response.data.message };
      }
    }
    return { message: 'Something went wrong' };
  };
  