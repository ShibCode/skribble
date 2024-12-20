type AvatarProps = {
  size: number;
  body: number;
  eyes: number;
  mouth: number;
  crown?: boolean;
};

const Avatar = ({
  size = 48,
  body = 0,
  eyes = 0,
  mouth = 0,
  crown = false,
}: AvatarProps) => {
  return (
    <div
      className="relative isolate"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        imageRendering: "pixelated",
      }}
    >
      {crown && (
        <img
          style={{ width: `${size / 2}px`, height: `${size / 2}px` }}
          src="/crown.gif"
          className="absolute z-10 -top-[22%] -left-[5%]"
        />
      )}

      <div
        style={{
          backgroundImage: "url(/body_atlas.gif)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: `${(100 / 9) * (body % 10)}% ${
            (100 / 9) * Math.floor(body / 10)
          }%`,
          backgroundSize: "1000%",
        }}
        className="absolute inset-0"
      ></div>
      <div
        style={{
          backgroundImage: "url(/eyes_atlas.gif)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: `${(100 / 9) * (eyes % 10)}% ${
            (100 / 9) * Math.floor(eyes / 10)
          }%`,
          backgroundSize: "1000%",
        }}
        className="absolute inset-0"
      ></div>
      <div
        style={{
          backgroundImage: "url(/mouth_atlas.gif)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: `${(100 / 9) * (mouth % 10)}% ${
            (100 / 9) * Math.floor(mouth / 10)
          }%`,
          backgroundSize: "1000%",
        }}
        className="absolute inset-0"
      ></div>
    </div>
  );
};

export default Avatar;
