

interface ICategory {
  _id: string;
  name: string;
}

interface IInstructor {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface ILecture {
  _id: string;
  title: string;
  freePreview: boolean;
  videoUrl: string;
}

interface ICourse {
  _id: string;
  title: string;
  instructorId: IInstructor;
  imageUrl: string;
  description: string;
  price: number;
  category: ICategory[];
  language: string[];
  level: string;
  objective: string[];
  lectures: ILecture[];
  enrollments: number;
  reviewsCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  isFeatured?: boolean;
  isEnrolled?: boolean;

}
