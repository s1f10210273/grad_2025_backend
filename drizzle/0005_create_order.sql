CREATE TABLE `orders` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`crew_id` varchar(64),
	`user_id` varchar(64) NOT NULL,
	`cart_id` bigint unsigned NOT NULL,
	`delivered_at` timestamp,
	`status_code` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
