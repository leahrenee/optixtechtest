export type PostReview = {
  isLoading: boolean;
  error: Error | null;
  postReview: (review: number) => Promise<PostReviewResponse | null>;
};

export type PostReviewRequest = {
  score: number;
};

export type PostReviewResponse = {
  message: string;
};
