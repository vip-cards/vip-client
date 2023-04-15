import dayjs from "dayjs";
import { getLocalizedWord } from "helpers/lang";
import { useNavigate } from "react-router";

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  return (
    <div
      key={post._id}
      className="job-card cursor-pointer"
      onClick={() => navigate("/jobs/posts/" + post._id)}
    >
      <h3 className="title">{getLocalizedWord(post.name)}</h3>
      <h4 className="sub-title">{getLocalizedWord(post.jobTitle)}</h4>
      <p className="body">
        <span>
          {getLocalizedWord(post.description)} - {post.phone}
        </span>
        <span className="whitespace-nowrap">
          {dayjs(post.publishDate).format("DD, MMM")}
        </span>
      </p>
    </div>
  );
};

export default PostCard;
