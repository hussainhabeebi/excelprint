CREATE TABLE `addresses` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`label` text,
	`line1` text NOT NULL,
	`line2` text,
	`city` text NOT NULL,
	`emirate` text,
	`country` text DEFAULT 'AE' NOT NULL,
	`postal_code` text,
	`is_default` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`name` text NOT NULL,
	`trn` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`phone` text,
	`email_verified_at` integer,
	`marketing_opt_in` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customers_email_idx` ON `customers` (`email`);--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `permissions_key_idx` ON `permissions` (`key`);--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`role_id` text NOT NULL,
	`permission_id` text NOT NULL,
	PRIMARY KEY(`role_id`, `permission_id`),
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `roles_name_idx` ON `roles` (`name`);--> statement-breakpoint
CREATE TABLE `user_roles` (
	`user_id` text NOT NULL,
	`role_id` text NOT NULL,
	PRIMARY KEY(`user_id`, `role_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`token_hash` text NOT NULL,
	`subject_type` text NOT NULL,
	`subject_id` text NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_sessions_token_hash_idx` ON `user_sessions` (`token_hash`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text NOT NULL,
	`phone` text,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`email_verified_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`parent_id` text,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`image_key` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`meta_title` text,
	`meta_description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_idx` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `pricing_rules` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text,
	`name` text NOT NULL,
	`rule_type` text NOT NULL,
	`modifier_type` text NOT NULL,
	`amount_cents` integer DEFAULT 0 NOT NULL,
	`amount_percent` real DEFAULT 0 NOT NULL,
	`applies_to` text,
	`priority` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`starts_at` integer,
	`ends_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_images` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`image_key` text NOT NULL,
	`alt` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_primary` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_option_values` (
	`id` text PRIMARY KEY NOT NULL,
	`option_id` text NOT NULL,
	`label` text NOT NULL,
	`value` text NOT NULL,
	`price_modifier_type` text,
	`price_modifier_cents` integer DEFAULT 0 NOT NULL,
	`price_modifier_percent` real DEFAULT 0 NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_default` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`option_id`) REFERENCES `product_options`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_options` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text DEFAULT 'SINGLE_SELECT' NOT NULL,
	`is_required` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`short_description` text,
	`starting_price_cents` integer DEFAULT 0 NOT NULL,
	`currency` text DEFAULT 'AED' NOT NULL,
	`production_time_standard_days` integer DEFAULT 3 NOT NULL,
	`production_time_express_days` integer,
	`artwork_requirements` text,
	`is_active` integer DEFAULT true NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`meta_title` text,
	`meta_description` text,
	`canonical_path` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_idx` ON `products` (`slug`);--> statement-breakpoint
CREATE TABLE `quantity_tiers` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`quantity` integer NOT NULL,
	`unit_price_cents` integer NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `cart_items` (
	`id` text PRIMARY KEY NOT NULL,
	`cart_id` text NOT NULL,
	`product_id` text NOT NULL,
	`quantity` integer NOT NULL,
	`configuration` text NOT NULL,
	`design_method` text,
	`unit_price_cents` integer NOT NULL,
	`total_price_cents` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `carts` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text,
	`session_token` text,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `order_item_options` (
	`id` text PRIMARY KEY NOT NULL,
	`order_item_id` text NOT NULL,
	`option_name` text NOT NULL,
	`option_value` text NOT NULL,
	`price_modifier_cents` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`order_item_id`) REFERENCES `order_items`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`product_id` text NOT NULL,
	`product_name_snapshot` text NOT NULL,
	`quantity` integer NOT NULL,
	`configuration_snapshot` text NOT NULL,
	`design_method` text,
	`unit_price_cents` integer NOT NULL,
	`total_price_cents` integer NOT NULL,
	`pricing_breakdown_snapshot` text NOT NULL,
	`artwork_status` text DEFAULT 'ARTWORK_REQUIRED' NOT NULL,
	`production_status` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `order_status_history` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`old_status` text,
	`new_status` text NOT NULL,
	`actor_type` text NOT NULL,
	`actor_id` text,
	`notes` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`order_number` text NOT NULL,
	`customer_id` text NOT NULL,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`payment_status` text DEFAULT 'UNPAID' NOT NULL,
	`subtotal_cents` integer DEFAULT 0 NOT NULL,
	`design_fee_cents` integer DEFAULT 0 NOT NULL,
	`urgency_fee_cents` integer DEFAULT 0 NOT NULL,
	`delivery_fee_cents` integer DEFAULT 0 NOT NULL,
	`discount_cents` integer DEFAULT 0 NOT NULL,
	`vat_cents` integer DEFAULT 0 NOT NULL,
	`total_cents` integer DEFAULT 0 NOT NULL,
	`currency` text DEFAULT 'AED' NOT NULL,
	`coupon_id` text,
	`delivery_method_id` text,
	`delivery_address_id` text,
	`billing_address_id` text,
	`notes_customer` text,
	`notes_internal` text,
	`placed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`delivery_address_id`) REFERENCES `addresses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`billing_address_id`) REFERENCES `addresses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_order_number_idx` ON `orders` (`order_number`);--> statement-breakpoint
CREATE TABLE `artwork_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`artwork_id` text NOT NULL,
	`version_number` integer NOT NULL,
	`source` text NOT NULL,
	`file_key` text NOT NULL,
	`file_name` text NOT NULL,
	`mime_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`uploaded_by_type` text NOT NULL,
	`uploaded_by_id` text,
	`notes` text,
	`status` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`artwork_id`) REFERENCES `artworks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `artworks` (
	`id` text PRIMARY KEY NOT NULL,
	`order_item_id` text NOT NULL,
	`current_version_id` text,
	`status` text DEFAULT 'ARTWORK_REQUIRED' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`order_item_id`) REFERENCES `order_items`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `ai_generations` (
	`id` text PRIMARY KEY NOT NULL,
	`order_item_id` text,
	`customer_id` text NOT NULL,
	`prompt` text NOT NULL,
	`model` text NOT NULL,
	`business_type` text,
	`style` text,
	`color_preference` text,
	`additional_description` text,
	`output_file_key` text,
	`output_url` text,
	`status` text DEFAULT 'QUEUED' NOT NULL,
	`error_message` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`order_item_id`) REFERENCES `order_items`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `design_request_files` (
	`id` text PRIMARY KEY NOT NULL,
	`design_request_id` text NOT NULL,
	`file_key` text NOT NULL,
	`file_name` text NOT NULL,
	`kind` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`design_request_id`) REFERENCES `design_requests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `design_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`order_item_id` text NOT NULL,
	`requested_by_customer_id` text NOT NULL,
	`company_name` text,
	`content_text` text,
	`contact_info` text,
	`logo_file_key` text,
	`preferred_colors` text,
	`design_notes` text,
	`style_preference` text,
	`assigned_designer_id` text,
	`status` text DEFAULT 'NEW' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`order_item_id`) REFERENCES `order_items`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`requested_by_customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assigned_designer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `proof_approvals` (
	`id` text PRIMARY KEY NOT NULL,
	`proof_id` text NOT NULL,
	`artwork_version_id` text NOT NULL,
	`customer_id` text NOT NULL,
	`order_id` text NOT NULL,
	`approved_filename` text NOT NULL,
	`approval_statement` text NOT NULL,
	`ip_address` text,
	`approved_at` integer NOT NULL,
	`invalidated_at` integer,
	FOREIGN KEY (`proof_id`) REFERENCES `proofs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`artwork_version_id`) REFERENCES `artwork_versions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `proof_comments` (
	`id` text PRIMARY KEY NOT NULL,
	`proof_id` text NOT NULL,
	`author_type` text NOT NULL,
	`author_id` text NOT NULL,
	`comment` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`proof_id`) REFERENCES `proofs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `proofs` (
	`id` text PRIMARY KEY NOT NULL,
	`order_item_id` text NOT NULL,
	`artwork_version_id` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`sent_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`order_item_id`) REFERENCES `order_items`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`artwork_version_id`) REFERENCES `artwork_versions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `payment_events` (
	`id` text PRIMARY KEY NOT NULL,
	`payment_id` text NOT NULL,
	`event_type` text NOT NULL,
	`provider_event_id` text NOT NULL,
	`raw_payload` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payment_events_provider_event_id_idx` ON `payment_events` (`provider_event_id`);--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`provider` text DEFAULT 'STRIPE' NOT NULL,
	`provider_payment_intent_id` text,
	`provider_checkout_session_id` text,
	`amount_cents` integer NOT NULL,
	`currency` text DEFAULT 'AED' NOT NULL,
	`status` text DEFAULT 'UNPAID' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `refunds` (
	`id` text PRIMARY KEY NOT NULL,
	`payment_id` text NOT NULL,
	`order_id` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`reason` text,
	`status` text DEFAULT 'REQUESTED' NOT NULL,
	`provider_refund_id` text,
	`requested_by_staff_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`requested_by_staff_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `quote_attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`quote_id` text NOT NULL,
	`file_key` text NOT NULL,
	`file_name` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `quote_items` (
	`id` text PRIMARY KEY NOT NULL,
	`quote_id` text NOT NULL,
	`description` text NOT NULL,
	`quantity` integer,
	`notes` text,
	FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `quotes` (
	`id` text PRIMARY KEY NOT NULL,
	`quote_number` text NOT NULL,
	`customer_name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text NOT NULL,
	`company` text,
	`product_description` text NOT NULL,
	`quantity` integer,
	`dimensions` text,
	`material` text,
	`deadline` integer,
	`description` text,
	`status` text DEFAULT 'NEW' NOT NULL,
	`quoted_price_cents` integer,
	`converted_order_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`converted_order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `quotes_quote_number_idx` ON `quotes` (`quote_number`);--> statement-breakpoint
CREATE TABLE `deliveries` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`delivery_method_id` text NOT NULL,
	`address_id` text,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`tracking_reference` text,
	`courier_name` text,
	`dispatched_at` integer,
	`delivered_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`delivery_method_id`) REFERENCES `delivery_methods`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `delivery_methods` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`fee_cents` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `coupons` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`description` text,
	`discount_type` text NOT NULL,
	`amount_cents` integer DEFAULT 0 NOT NULL,
	`amount_percent` real DEFAULT 0 NOT NULL,
	`min_order_cents` integer DEFAULT 0 NOT NULL,
	`usage_limit` integer,
	`usage_count` integer DEFAULT 0 NOT NULL,
	`starts_at` integer,
	`ends_at` integer,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `coupons_code_idx` ON `coupons` (`code`);--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`recipient_type` text NOT NULL,
	`recipient_id` text NOT NULL,
	`channel` text DEFAULT 'EMAIL' NOT NULL,
	`template_key` text NOT NULL,
	`payload` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`sent_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`meta_title` text,
	`meta_description` text,
	`cover_image_key` text,
	`is_published` integer DEFAULT false NOT NULL,
	`published_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_idx` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE TABLE `redirects` (
	`id` text PRIMARY KEY NOT NULL,
	`from_path` text NOT NULL,
	`to_path` text NOT NULL,
	`status_code` integer DEFAULT 301 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `redirects_from_path_idx` ON `redirects` (`from_path`);--> statement-breakpoint
CREATE TABLE `seo_pages` (
	`id` text PRIMARY KEY NOT NULL,
	`path` text NOT NULL,
	`page_type` text NOT NULL,
	`meta_title` text NOT NULL,
	`meta_description` text NOT NULL,
	`canonical` text,
	`h1` text NOT NULL,
	`intro_content` text,
	`body_content` text,
	`faq` text,
	`related_product_ids` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `seo_pages_path_idx` ON `seo_pages` (`path`);--> statement-breakpoint
CREATE TABLE `staff_assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`order_item_id` text NOT NULL,
	`staff_id` text NOT NULL,
	`role` text NOT NULL,
	`assigned_at` integer NOT NULL,
	`unassigned_at` integer,
	FOREIGN KEY (`order_item_id`) REFERENCES `order_items`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`staff_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_type` text NOT NULL,
	`actor_id` text,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`old_value` text,
	`new_value` text,
	`ip_address` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL
);
