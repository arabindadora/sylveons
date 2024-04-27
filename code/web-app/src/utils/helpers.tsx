import React from "react";

export function useCombinedRefs(...refs: React.MutableRefObject<any>[]) {
  const targetRef = React.useRef();

  React.useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") {
        (ref as Function)(targetRef.current);
      } else if (ref.current) {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
}
