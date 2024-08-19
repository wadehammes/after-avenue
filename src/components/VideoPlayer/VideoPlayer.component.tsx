"use client";

import classNames from "classnames";
import ReactPlayer from "react-player/lazy";
import styles from "src/components/VideoPlayer/VideoPlayer.module.css";
import { useIsBrowser } from "src/hooks/useIsBrowser";

interface VideoPlayerProps {
	url: string;
	rounded?: boolean;
}

export const VideoPlayer = (props: VideoPlayerProps) => {
	const { url, rounded } = props;
	const isBrowser = useIsBrowser();

	if (!isBrowser) {
		return null;
	}

	return (
		<div
			className={classNames(styles.videoPlayer, { [styles.rounded]: rounded })}
		>
			<ReactPlayer controls url={url} playing loop muted>
				VideoPlayer
			</ReactPlayer>
		</div>
	);
};
