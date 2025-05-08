CREATE TABLE `cart_items` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`cart_id` bigint unsigned NOT NULL,
	`item_id` bigint unsigned NOT NULL,
	`item_name` varchar(255) NOT NULL,
	`item_price` bigint unsigned NOT NULL,
	`store_id` varchar(64) NOT NULL,
	`quantity` bigint unsigned NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `cart_items_id` PRIMARY KEY(`id`)
);
