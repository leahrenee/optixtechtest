export type PostReview = {
  isLoading: boolean;
  error: Error | null;
  postReview: (review: string) => Promise<PostReviewResponse | null>;
};

export type PostReviewRequest = {
  review: string;
};

export type PostReviewResponse = {
  message: string;
};
