import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {createPost} from "../serivce/postService.js";
import useFormStore from "../stores/formStore.js";
import useUserStore from "../stores/userStore.js";

function WritePage() {
  const navigate = useNavigate();
  const {
    getSchema,
    setSubmitting
  } = useFormStore();
  const user = useUserStore((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting
    },
  } = useForm({
    resolver: zodResolver(getSchema()),
  });

  const onSubmit = async (data) => {
    try {
      if (!user) {
        alert("로그인 후 이용해 주세요.");
        navigate("/login");
        return;
      }

      setSubmitting(true);

      const postData = {
        title: data.title,
        content: data.content,
        authorId: user.id
      };

      const {
        data: _,
        error
      } = await createPost(postData);

      if (error) {
        throw new Error("서버에서 게시물 생성에 실패했습니다.");
      }

      navigate("/");
    } catch (error) {
      console.error("게시물 작성 중 에러 발생:", error);
      alert("게시물 작성 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">새 게시물 작성</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-control">
          <label className="label" htmlFor="title">
            <span className="label-text">제목</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="제목을 입력하세요"
            className="input input-bordered w-full"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>


        <div className="form-control">
          <label className="label" htmlFor="content">
            <span className="label-text">내용</span>
          </label>
          <textarea
            id="content"
            placeholder="내용을 입력하세요"
            className="textarea textarea-bordered h-48 w-full"
            {...register("content")}
          />
          {errors.content && (
            <p className="text-red-500 text-xs mt-1">
              {errors.content.message}
            </p>
          )}
        </div>


        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full"
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner"></span>
              제출 중...
            </>
          ) : (
            "제출하기"
          )}
        </button>
      </form>
    </div>
  );
}

export default WritePage;
