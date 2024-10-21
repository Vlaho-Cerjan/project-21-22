import Divider from '../../common/divider/divider';
import Skeleton from '../../common/skeleton/skeleton';

export default function SignageSliderSkeleton() {
  return (
    <div className="signageSliderSkeleton">
      <div className="topSlider">
        <div className="header">
          <Skeleton className="titleSkeleton" />
          <Skeleton className="buttonSkeleton" />
        </div>
        <div className="slider">
          <div className="sliderWrapper">
            <Skeleton className="sliderSkeleton" />
            <Skeleton className="sliderSkeleton" />
          </div>
        </div>
        <div className="footer">
          <div className="pagination">
            <Skeleton className="paginationSkeleton" />
            <Skeleton className="paginationSkeleton" />
            <Skeleton className="paginationSkeleton" />
          </div>
          <Skeleton className="dropdownSkeleton" />
        </div>
      </div>
      <Divider className="white" />
      <div className="bottomSliderContainer active">
        <div className="bottomSlider">
          <div className="sliderWrapper">
            <div className="sliderSkeletonContainer">
              <Skeleton className="textSliderSkeleton" />
            </div>
            <div className="sliderSkeletonContainer">
              <Skeleton className="textSliderSkeleton" />
            </div>
          </div>
        </div>
        <div className="footer bottomFooter">
          <div className="pagination">
            <Skeleton className="paginationSkeleton" />
            <Skeleton className="paginationSkeleton" />
            <Skeleton className="paginationSkeleton" />
          </div>
          <div className="colorSkeletonContainer">
            <Skeleton className="colorSkeleton" />
            <Skeleton className="colorSkeleton" />
          </div>
          <Skeleton className="dropdownSkeleton" />
        </div>
      </div>
    </div>
  );
}
