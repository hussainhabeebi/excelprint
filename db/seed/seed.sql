-- Development seed data (spec section 43). Pricing here is placeholder /
-- example data for local development only — never present these numbers
-- as official Excel Printing pricing.

-- Roles ----------------------------------------------------------------
INSERT INTO roles (id, name, description) VALUES
  ('role_super_admin', 'SUPER_ADMIN', 'Full system access'),
  ('role_admin', 'ADMIN', 'Operational access'),
  ('role_designer', 'DESIGNER', 'Artwork, design and proof access'),
  ('role_production', 'PRODUCTION', 'Production queue access'),
  ('role_accounting', 'ACCOUNTING', 'Payments and invoices access'),
  ('role_customer_support', 'CUSTOMER_SUPPORT', 'Customer and order support access');

-- Dev super-admin user. Password is "ChangeMe123!" (the hash below is a
-- real scrypt hash of that literal string, generated with
-- lib/auth/password.ts's exact parameters so it verifies correctly).
-- Local development only — rotate immediately in any shared/deployed
-- environment; never reuse this password anywhere real.
INSERT INTO users (id, email, password_hash, name, status, created_at, updated_at) VALUES
  ('user_dev_admin', 'admin@excelprintajman.dev',
   'scrypt$32768$8$1$28f4a35217844d7e9c29b1f45789cf12$8548eb8505c4715e7e43d414a709f02d8cf4f9c4c295b827233424cf5bd572db',
   'Dev Admin', 'ACTIVE', unixepoch() * 1000, unixepoch() * 1000);
INSERT INTO user_roles (user_id, role_id) VALUES ('user_dev_admin', 'role_super_admin');

-- Delivery methods -------------------------------------------------------
INSERT INTO delivery_methods (id, type, name, description, fee_cents, is_active, sort_order) VALUES
  ('dm_pickup', 'PICKUP', 'Store Pickup', 'Collect from our Ajman location', 0, 1, 0),
  ('dm_local', 'LOCAL_DELIVERY', 'Local Delivery', 'Delivered within Ajman', 2500, 1, 1),
  ('dm_courier', 'COURIER', 'Courier', 'Delivered nationwide via courier', 5000, 1, 2);

-- Categories ---------------------------------------------------------------
INSERT INTO categories (id, name, slug, description, sort_order, is_active, created_at, updated_at) VALUES
  ('cat_business_printing', 'Business Printing', 'business-printing', 'Business cards, letterheads and stationery', 0, 1, unixepoch() * 1000, unixepoch() * 1000),
  ('cat_marketing_printing', 'Marketing Printing', 'marketing-printing', 'Flyers, brochures and posters', 1, 1, unixepoch() * 1000, unixepoch() * 1000);

-- Example product: Business Cards -------------------------------------------
INSERT INTO products (
  id, category_id, name, slug, description, short_description,
  starting_price_cents, currency, production_time_standard_days, production_time_express_days,
  artwork_requirements, is_active, is_featured, meta_title, meta_description, canonical_path,
  created_at, updated_at
) VALUES (
  'prod_business_cards', 'cat_business_printing', 'Business Cards', 'business-cards',
  'Premium business cards with a range of paper stocks and finishes. Example/development data.',
  'Premium matte, gloss or soft-touch finishes.',
  4500, 'AED', 3, 1,
  '{"format":"PDF","resolutionDpi":300,"colorProfile":"CMYK","bleedMm":3,"safeMarginMm":5,"fontRule":"Outline or embed all fonts"}',
  1, 1, 'Business Card Printing in Ajman | Excel Printing',
  'Configure and order custom business cards online. Multiple finishes, fast turnaround, printed in Ajman.',
  '/business-card-printing-ajman',
  unixepoch() * 1000, unixepoch() * 1000
);

INSERT INTO quantity_tiers (id, product_id, quantity, unit_price_cents, sort_order) VALUES
  ('qt_bc_100', 'prod_business_cards', 100, 45, 0),
  ('qt_bc_250', 'prod_business_cards', 250, 38, 1),
  ('qt_bc_500', 'prod_business_cards', 500, 32, 2),
  ('qt_bc_1000', 'prod_business_cards', 1000, 27, 3),
  ('qt_bc_2000', 'prod_business_cards', 2000, 22, 4);

INSERT INTO product_options (id, product_id, name, type, is_required, sort_order) VALUES
  ('opt_bc_size', 'prod_business_cards', 'Size', 'SINGLE_SELECT', 1, 0),
  ('opt_bc_printing', 'prod_business_cards', 'Printing', 'SINGLE_SELECT', 1, 1),
  ('opt_bc_paper', 'prod_business_cards', 'Paper', 'SINGLE_SELECT', 1, 2),
  ('opt_bc_finish', 'prod_business_cards', 'Finish', 'SINGLE_SELECT', 1, 3),
  ('opt_bc_enhancements', 'prod_business_cards', 'Enhancements', 'MULTI_SELECT', 0, 4);

INSERT INTO product_option_values (id, option_id, label, value, price_modifier_type, price_modifier_cents, price_modifier_percent, sort_order, is_default) VALUES
  ('optv_bc_size_90x50', 'opt_bc_size', '90 x 50 mm', '90x50', 'FIXED', 0, 0, 0, 1),
  ('optv_bc_size_85x55', 'opt_bc_size', '85 x 55 mm', '85x55', 'FIXED', 0, 0, 1, 0),
  ('optv_bc_size_custom', 'opt_bc_size', 'Custom Size', 'custom', 'FIXED', 500, 0, 2, 0),

  ('optv_bc_print_single', 'opt_bc_printing', 'Single-sided', 'single', 'FIXED', 0, 0, 0, 1),
  ('optv_bc_print_double', 'opt_bc_printing', 'Double-sided', 'double', 'PERCENT', 0, 15, 1, 0),

  ('optv_bc_paper_300', 'opt_bc_paper', '300 GSM', '300gsm', 'FIXED', 0, 0, 0, 1),
  ('optv_bc_paper_350', 'opt_bc_paper', '350 GSM', '350gsm', 'FIXED', 1000, 0, 1, 0),
  ('optv_bc_paper_400', 'opt_bc_paper', '400 GSM', '400gsm', 'FIXED', 2000, 0, 2, 0),
  ('optv_bc_paper_premium', 'opt_bc_paper', 'Premium', 'premium', 'FIXED', 4000, 0, 3, 0),

  ('optv_bc_finish_none', 'opt_bc_finish', 'No Lamination', 'none', 'FIXED', 0, 0, 0, 1),
  ('optv_bc_finish_matte', 'opt_bc_finish', 'Matte Lamination', 'matte', 'FIXED', 1500, 0, 1, 0),
  ('optv_bc_finish_gloss', 'opt_bc_finish', 'Gloss Lamination', 'gloss', 'FIXED', 1500, 0, 2, 0),
  ('optv_bc_finish_softtouch', 'opt_bc_finish', 'Soft-touch Lamination', 'soft-touch', 'FIXED', 3000, 0, 3, 0),

  ('optv_bc_enh_spotuv', 'opt_bc_enhancements', 'Spot UV', 'spot-uv', 'FIXED', 5000, 0, 0, 0),
  ('optv_bc_enh_goldfoil', 'opt_bc_enhancements', 'Gold Foil', 'gold-foil', 'FIXED', 8000, 0, 1, 0),
  ('optv_bc_enh_silverfoil', 'opt_bc_enhancements', 'Silver Foil', 'silver-foil', 'FIXED', 8000, 0, 2, 0),
  ('optv_bc_enh_embossing', 'opt_bc_enhancements', 'Embossing', 'embossing', 'FIXED', 6000, 0, 3, 0),
  ('optv_bc_enh_roundedcorners', 'opt_bc_enhancements', 'Rounded Corners', 'rounded-corners', 'FIXED', 2000, 0, 4, 0);

-- Global urgency modifier (applies to any product's express production choice)
INSERT INTO pricing_rules (id, product_id, name, rule_type, modifier_type, amount_cents, amount_percent, applies_to, priority, is_active, created_at, updated_at) VALUES
  ('rule_global_express', NULL, 'Express production', 'URGENCY', 'PERCENT', 0, 25, '{"productionSpeed":"express"}', 0, 1, unixepoch() * 1000, unixepoch() * 1000),
  ('rule_global_same_day', NULL, 'Same-day production', 'URGENCY', 'PERCENT', 0, 50, '{"productionSpeed":"same_day"}', 0, 1, unixepoch() * 1000, unixepoch() * 1000);

-- Example product: Flyers ---------------------------------------------------
INSERT INTO products (
  id, category_id, name, slug, description, short_description,
  starting_price_cents, currency, production_time_standard_days, production_time_express_days,
  is_active, is_featured, meta_title, meta_description, canonical_path,
  created_at, updated_at
) VALUES (
  'prod_flyers', 'cat_marketing_printing', 'Flyers', 'flyers',
  'Eye-catching flyers for promotions, events and marketing campaigns. Example/development data.',
  'Vivid, full-colour flyers on your choice of paper stock.',
  6000, 'AED', 3, 1,
  1, 1, 'Flyer Printing in Ajman | Excel Printing',
  'Order custom flyers online with instant pricing. Multiple sizes and paper stocks, printed in Ajman.',
  '/flyer-printing-ajman',
  unixepoch() * 1000, unixepoch() * 1000
);

INSERT INTO quantity_tiers (id, product_id, quantity, unit_price_cents, sort_order) VALUES
  ('qt_fl_250', 'prod_flyers', 250, 60, 0),
  ('qt_fl_500', 'prod_flyers', 500, 45, 1),
  ('qt_fl_1000', 'prod_flyers', 1000, 35, 2),
  ('qt_fl_2500', 'prod_flyers', 2500, 28, 3),
  ('qt_fl_5000', 'prod_flyers', 5000, 22, 4);
