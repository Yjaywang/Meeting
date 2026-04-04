import React from "react";
import linkedInImg from "../assets/images/linkedin_icon.png";
import githubImg from "../assets/images/github_icon.png";

const Footer: React.FC = () => {
  return (
    <div className="flex h-[30px] bg-footer text-surface text-[11px] font-semibold items-center justify-center">
      <div>Copyright &#169;2023 Jaywang-project</div>
      <div className="flex gap-[10px] ml-[10px]">
        <a
          href="https://github.com/Yjaywang/Meeting"
        >
          <div className="h-[15px] w-[15px]">
            <img className="w-full h-full" src={githubImg} alt="" />
          </div>
        </a>
        <a
          href="https://www.linkedin.com/in/yan-lin-wang-51a934240/"
        >
          <div className="h-[15px] w-[15px]">
            <img className="w-full h-full" src={linkedInImg} alt="" />
          </div>
        </a>
      </div>
    </div>
  );
};

export default Footer;
