import dayjs from "dayjs";
import { getLocalizedWord } from "helpers/lang";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      layout
      key={post._id}
      whileHover={{
        scale: 1.05,
      }}
      transition={{
        duration: 0.2,
        type: "spring",
        stiffness: 260,
        damping: 14,
      }}
      className="job-card cursor-pointer bg-gray-300"
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
    </motion.div>
  );
};

export default PostCard;
