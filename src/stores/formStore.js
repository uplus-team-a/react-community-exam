import {z} from 'zod';
import {create} from 'zustand';

const postSchema = z.object({
  title: z.string()
    .min(3, "제목은 3글자 이상이어야 합니다."),
  content: z.string()
    .min(10, "내용은 10글자 이상이어야 합니다."),
});

const useFormStore = create((set) => ({
  errors: {},
  isSubmitting: false,

  validateForm: (data) => {

    try {
      postSchema.parse(data);
      set({errors: {}});
      return true;

    } catch (error) {
      const formattedErrors = {};

      error.errors.forEach((err) => {
        const path = err.path.join('.');
        formattedErrors[path] = err.message;
      });

      set({errors: formattedErrors});

      return false;
    }
  },

  setSubmitting: (isSubmitting) => {
    set({isSubmitting});
  },

  getSchema: () => postSchema,
}));

export default useFormStore;
