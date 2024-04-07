import { useState } from "react";
import { postData } from "../../api";
import {
  PostReview,
  PostReviewRequest,
  PostReviewResponse,
} from "./usePostReview.types";

export const usePostReview = (): PostReview => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const postReview = async (
    review: number
  ): Promise<PostReviewResponse | null> => {
    let response = null;

    try {
      setIsLoading(true);
      setError(null);
      response = await postData<PostReviewRequest, PostReviewResponse>(
        "submitReview",
        { score: review }
      );
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }

    return response;
  };

  return { isLoading, error, postReview };
};
