import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import classnames from "classnames";
import styles from "css/components/toast.module.scss";

const notificationTimeout = 3000;

type ToastType = "success" | "error" | "notice";

interface ToastProps {
	notification?: string;
	type?: ToastType;
}

interface NotificationItem {
	type: ToastType;
	text: string;
}

const Toast = ({ notification, type = "notice" }: ToastProps) => {
	const [notifications, setNotifications] = useState<NotificationItem[]>([]);

	const addNotification = (text: string, type: ToastType) => {
		setNotifications([...notifications, { type, text }]);
		setTimeout(
			() => setNotifications(notifications.filter((n) => n.text !== text)),
			notificationTimeout,
		);
	};

	useEffect(() => {
		if (notification) {
			addNotification(notification, type);
		}
	}, []);

	useEffect(() => {
		addNotification(notification || "", type);
	}, [notification]);

	return notifications.map((notification, i) =>
		createPortal(
			<div
				key={`notification-${i}`}
				className={classnames(styles.toast, styles[`toast--${type}`])}
			>
				{notification.text}
			</div>,
			document.body,
		),
	);
};

export default Toast;
