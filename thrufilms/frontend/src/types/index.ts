// All TypeScript interfaces for ThruFilms

export interface User {
  id: number;
  email: string;
  role: "actor" | "crew" | "filmmaker";
  created_at: string;
  profile?: Profile;
}

export interface Profile {
  id: number;
  user_id: number;
  name: string;
  bio: string;
  location: string;
  skills: string[];
  profile_image_url: string;
  portfolio_urls: string[];
}

export interface Post {
  id: number;
  user_id: number;
  title: string;
  description: string;
  role_needed: string;
  location: string;
  budget_type: "paid" | "unpaid" | "collaboration";
  contact: string;
  gender?: string;
  age_range?: string;
  shoot_dates?: string;
  compensation_details?: string;
  lat?: number;
  lng?: number;
  created_at: string;
  owner_name?: string;
  owner_image?: string;
  upvotes: number;
  downvotes: number;
  comment_count: number;
  user_vote?: number | null; // 1 = upvoted, -1 = downvoted, null = no vote
}

export interface PostListResponse {
  posts: Post[];
  total: number;
  page: number;
  per_page: number;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  author_name?: string;
  author_image?: string;
  author_role?: string;
}

export interface Application {
  id: number;
  post_id: number;
  applicant_id: number;
  message: string;
  applied_at: string;
  applicant_name?: string;
  applicant_role?: string;
  applicant_image?: string;
  applicant_location?: string;
  applicant_skills?: string[];
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  user_id: number;
  role: string;
}

export const SKILLS = [
  "Acting",
  "Direction",
  "Cinematography (DOP)",
  "Editing",
  "Sound Design",
  "Screenwriting",
  "Production Design",
  "Costume Design",
  "Makeup",
  "VFX",
  "Color Grading",
  "Music Composition",
  "Photography",
  "Stunt",
  "Producing",
];

export const INDIAN_CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Kochi",
  "Chandigarh",
  "Lucknow",
  "Bhopal",
  "Indore",
  "Nagpur",
  "Coimbatore",
  "Surat",
  "Vadodara",
  "Thiruvananthapuram",
  "Guwahati",
  "Other",
];

export const ROLES_NEEDED = [
  "Actor",
  "Actress",
  "Director",
  "DOP / Cinematographer",
  "Editor",
  "Screenwriter",
  "Sound Engineer",
  "Production Designer",
  "Costume Designer",
  "Makeup Artist",
  "VFX Artist",
  "Color Grader",
  "Music Composer",
  "Producer",
  "Assistant Director",
  "Camera Operator",
  "Other",
];
