BEGIN TRANSACTION;
CREATE TABLE data_source (
	id INTEGER NOT NULL, 
	name VARCHAR, 
	source_type VARCHAR, 
	file_path VARCHAR, 
	schema_info JSON, 
	health_score FLOAT, 
	quality_report JSON, 
	organization_id INTEGER NOT NULL, 
	created_by INTEGER NOT NULL, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	updated_at DATETIME, settings JSON DEFAULT '{"missing_threshold": 10.0, "duplicate_threshold": 5.0, "sensitivity": "balanced"}', 
	PRIMARY KEY (id), 
	FOREIGN KEY(organization_id) REFERENCES organization (id), 
	FOREIGN KEY(created_by) REFERENCES user (id)
);
INSERT INTO "data_source" VALUES(2,'ecommerce_transactions.csv','csv',NULL,'{"transaction_id": "str", "customer_id": "str", "product_category": "str", "amount_usd": "float64", "quantity": "int64", "payment_method": "str", "shipping_status": "str", "date": "str", "country": "str", "discount_applied": "float64"}',99.62,'{"health_score": 99.62, "summary": {"total_rows": 101, "total_columns": 10, "missing_values_total": 3, "duplicate_rows": 1}, "columns": {"transaction_id": {"dtype": "str", "missing_pct": 0.0, "cardinality": 100, "is_date_candidate": false, "outliers": 0}, "customer_id": {"dtype": "str", "missing_pct": 0.0, "cardinality": 33, "is_date_candidate": false, "outliers": 0}, "product_category": {"dtype": "str", "missing_pct": 0.0, "cardinality": 5, "is_date_candidate": false, "outliers": 0}, "amount_usd": {"dtype": "float64", "missing_pct": 2.97, "cardinality": 97, "is_date_candidate": false, "outliers": 1}, "quantity": {"dtype": "int64", "missing_pct": 0.0, "cardinality": 9, "is_date_candidate": false, "outliers": 0}, "payment_method": {"dtype": "str", "missing_pct": 0.0, "cardinality": 4, "is_date_candidate": false, "outliers": 0}, "shipping_status": {"dtype": "str", "missing_pct": 0.0, "cardinality": 4, "is_date_candidate": false, "outliers": 0}, "date": {"dtype": "str", "missing_pct": 0.0, "cardinality": 28, "is_date_candidate": false, "outliers": 0}, "country": {"dtype": "str", "missing_pct": 0.0, "cardinality": 5, "is_date_candidate": false, "outliers": 0}, "discount_applied": {"dtype": "float64", "missing_pct": 0.0, "cardinality": 5, "is_date_candidate": false, "outliers": 0}}, "alerts": []}',1,1,'2026-02-16 04:46:18',NULL,'{"missing_threshold": 10.0, "duplicate_threshold": 5.0, "sensitivity": "balanced"}');
CREATE TABLE insight (
	id INTEGER NOT NULL, 
	title VARCHAR NOT NULL, 
	description VARCHAR NOT NULL, 
	impact_level VARCHAR, 
	confidence_score FLOAT, 
	evidence JSON, 
	ai_root_cause VARCHAR, 
	category VARCHAR, 
	status VARCHAR, 
	data_source_id INTEGER, 
	organization_id INTEGER NOT NULL, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, visualization_data JSON, 
	PRIMARY KEY (id), 
	FOREIGN KEY(data_source_id) REFERENCES data_source (id), 
	FOREIGN KEY(organization_id) REFERENCES organization (id)
);
INSERT INTO "insight" VALUES(1,'Customer Churn Risk Correlation','A 15% increase in technical response time correlates with a 4% increase in churn within the Enterprise segment.','High',92.0,NULL,'Latency in high-priority SLA ticket assignment.','Operations','dismissed',NULL,1,'2026-02-15 14:56:09',NULL);
INSERT INTO "insight" VALUES(2,'Ad Spend Allocation Anomaly','LinkedIn campaigns show 2.4x higher ROI on B2B SaaS leads compared to Google Search.','Medium',85.0,NULL,'Lead quality from demographic targeting outweighs intent-based search.','Marketing','dismissed',NULL,1,'2026-02-15 14:56:09',NULL);
INSERT INTO "insight" VALUES(3,'Customer Churn Risk Correlation','A 15% increase in technical response time correlates with a 4% increase in churn within the Enterprise segment.','High',92.0,NULL,'Latency in high-priority SLA ticket assignment.','Operations','dismissed',NULL,1,'2026-02-15 17:06:28',NULL);
INSERT INTO "insight" VALUES(4,'Ad Spend Allocation Anomaly','LinkedIn campaigns show 2.4x higher ROI on B2B SaaS leads compared to Google Search.','Medium',85.0,NULL,'Lead quality from demographic targeting outweighs intent-based search.','Marketing','dismissed',NULL,1,'2026-02-15 17:06:28',NULL);
INSERT INTO "insight" VALUES(5,'Customer Churn Risk Correlation','A 15% increase in technical response time correlates with a 4% increase in churn within the Enterprise segment.','High',92.0,NULL,'Latency in high-priority SLA ticket assignment.','Operations','dismissed',NULL,1,'2026-02-15 17:06:36',NULL);
INSERT INTO "insight" VALUES(6,'Ad Spend Allocation Anomaly','LinkedIn campaigns show 2.4x higher ROI on B2B SaaS leads compared to Google Search.','Medium',85.0,NULL,'Lead quality from demographic targeting outweighs intent-based search.','Marketing','dismissed',NULL,1,'2026-02-15 17:06:36',NULL);
INSERT INTO "insight" VALUES(7,'Customer Churn Risk Correlation','A 15% increase in technical response time correlates with a 4% increase in churn within the Enterprise segment.','High',92.0,NULL,'Latency in high-priority SLA ticket assignment.','Operations','dismissed',NULL,1,'2026-02-15 17:06:38',NULL);
INSERT INTO "insight" VALUES(8,'Ad Spend Allocation Anomaly','LinkedIn campaigns show 2.4x higher ROI on B2B SaaS leads compared to Google Search.','Medium',85.0,NULL,'Lead quality from demographic targeting outweighs intent-based search.','Marketing','dismissed',NULL,1,'2026-02-15 17:06:38',NULL);
INSERT INTO "insight" VALUES(9,'Customer Churn Risk Correlation','A 15% increase in technical response time correlates with a 4% increase in churn within the Enterprise segment.','High',92.0,NULL,'Latency in high-priority SLA ticket assignment.','Operations','dismissed',NULL,1,'2026-02-15 17:06:43',NULL);
INSERT INTO "insight" VALUES(10,'Ad Spend Allocation Anomaly','LinkedIn campaigns show 2.4x higher ROI on B2B SaaS leads compared to Google Search.','Medium',85.0,NULL,'Lead quality from demographic targeting outweighs intent-based search.','Marketing','dismissed',NULL,1,'2026-02-15 17:06:43',NULL);
INSERT INTO "insight" VALUES(11,'Customer Churn Risk Correlation','A 15% increase in technical response time correlates with a 4% increase in churn within the Enterprise segment.','High',92.0,NULL,'Latency in high-priority SLA ticket assignment.','Operations','dismissed',NULL,1,'2026-02-15 17:06:52',NULL);
INSERT INTO "insight" VALUES(12,'Ad Spend Allocation Anomaly','LinkedIn campaigns show 2.4x higher ROI on B2B SaaS leads compared to Google Search.','Medium',85.0,NULL,'Lead quality from demographic targeting outweighs intent-based search.','Marketing','dismissed',NULL,1,'2026-02-15 17:06:52',NULL);
INSERT INTO "insight" VALUES(13,'Optimization Opportunity in Marketing Spend','The marketing performance data shows a high cardinality in spend_usd, indicating potential for optimization and cost savings','High',92.0,NULL,'Linear regression analysis reveals a statistically significant relationship between spend_usd and roi_score','Marketing','dismissed',NULL,1,'2026-02-15 18:57:18',NULL);
INSERT INTO "insight" VALUES(14,'Anomaly in Conversion Rates','The conversions column has a lower cardinality compared to other columns, suggesting potential issues with conversion tracking or attribution modeling','Medium',85.0,NULL,'Kolmogorov-Smirnov test detects a deviation from expected distribution in conversions, possibly indicating data quality issues','Sales','dismissed',NULL,1,'2026-02-15 18:57:18',NULL);
INSERT INTO "insight" VALUES(15,'Outlier in ROI Score','The presence of a single outlier in the roi_score column may indicate an exceptional marketing campaign or an error in data collection','Medium',78.0,NULL,'Isolation forest algorithm identifies the outlier as a potential anomaly, warranting further investigation','Finance','dismissed',NULL,1,'2026-02-15 18:57:18',NULL);
INSERT INTO "insight" VALUES(16,'High Churn Risk in SaaS Subscriptions','A significant number of SaaS subscriptions have a high churn risk score, indicating potential revenue loss','High',92.0,NULL,'Outliers in mrr_usd column and missing values in churn_risk_score column','Sales','dismissed',NULL,1,'2026-02-15 19:10:44',NULL);
INSERT INTO "insight" VALUES(17,'Inefficient Marketing Spend','Some marketing campaigns have a low return on investment, suggesting inefficient allocation of marketing budget','Medium',85.0,NULL,'Outlier in roi_score column and high cardinality in spend_usd column','Marketing','resolved',NULL,1,'2026-02-15 19:10:44',NULL);
INSERT INTO "insight" VALUES(18,'Opportunity for Upselling in SaaS Subscriptions','A large number of SaaS subscriptions have a low user count, indicating potential for upselling and revenue growth','High',95.0,NULL,'Low cardinality in user_count column and high cardinality in plan_type column','Sales','dismissed',NULL,1,'2026-02-15 19:10:44',NULL);
INSERT INTO "insight" VALUES(19,'High Patient Engagement','The organization is experiencing high patient engagement with a diverse age range of patients visiting the healthcare facility.','High',90.0,NULL,'Effective marketing strategies targeting a wide range of age groups','Operations','dismissed',NULL,1,'2026-02-16 04:21:24','[{"type": "area", "title": "Patient Age Distribution", "data": [{"name": "18-24", "val": 10}, {"name": "25-34", "val": 15}, {"name": "35-44", "val": 20}, {"name": "45-54", "val": 25}, {"name": "55-64", "val": 20}, {"name": "65+", "val": 10}], "metrics": [{"key": "val", "color": "#4f46e5", "name": "Number of Patients"}]}, {"type": "pie", "title": "Visit Reason Distribution", "data": [{"name": "Check-up", "value": 40}, {"name": "Treatment", "value": 30}, {"name": "Emergency", "value": 30}]}]');
INSERT INTO "insight" VALUES(20,'Opportunity for Targeted Healthcare Services','There is an opportunity for the organization to offer targeted healthcare services to patients with specific health needs.','Medium',80.0,NULL,'Identifying patient segments with unique healthcare requirements','Marketing','dismissed',NULL,1,'2026-02-16 04:21:24','[{"type": "bar", "title": "Blood Sugar Level Distribution", "data": [{"name": "Normal", "val": 60}, {"name": "Pre-diabetic", "val": 20}, {"name": "Diabetic", "val": 20}], "metrics": [{"key": "val", "color": "#4f46e5", "name": "Number of Patients"}]}, {"type": "area", "title": "Heart Rate Trend", "data": [{"name": "Jan", "val": 50}, {"name": "Feb", "val": 55}, {"name": "Mar", "val": 60}], "metrics": [{"key": "val", "color": "#4f46e5", "name": "Average Heart Rate"}]}]');
INSERT INTO "insight" VALUES(21,'Potential Revenue Stream through BMI-related Services','The organization can potentially generate revenue by offering BMI-related services to patients.','Medium',85.0,NULL,'Capitalizing on the growing demand for health and wellness services','Finance','dismissed',NULL,1,'2026-02-16 04:21:24','[{"type": "pie", "title": "BMI Distribution", "data": [{"name": "Underweight", "value": 10}, {"name": "Normal", "value": 60}, {"name": "Overweight", "value": 20}, {"name": "Obese", "value": 10}]}, {"type": "area", "title": "BMI Trend", "data": [{"name": "Jan", "val": 20}, {"name": "Feb", "val": 22}, {"name": "Mar", "val": 25}], "metrics": [{"key": "val", "color": "#4f46e5", "name": "Average BMI"}]}]');
INSERT INTO "insight" VALUES(22,'High-Value Customer Segments','Identifying high-spending customer groups can help tailor marketing strategies and improve sales','High',90.0,NULL,'Customer purchasing behavior and demographic characteristics','Marketing','resolved',NULL,1,'2026-02-16 04:46:27','[{"type": "bar", "title": "Customer Spend by Category", "data": [{"name": "Electronics", "value": 1500}, {"name": "Fashion", "value": 800}, {"name": "Home Goods", "value": 1200}], "metrics": [{"key": "value", "color": "#4f46e5", "name": "Spend"}]}, {"type": "pie", "title": "Customer Distribution by Region", "data": [{"name": "North", "value": 30}, {"name": "South", "value": 25}, {"name": "East", "value": 20}, {"name": "West", "value": 25}]}]');
INSERT INTO "insight" VALUES(23,'Optimizing Healthcare Resource Allocation','Analyzing patient vital signs and visit reasons can help optimize resource allocation and improve patient outcomes','Medium',85.0,NULL,'Patient health trends and resource utilization patterns','Operations','dismissed',NULL,1,'2026-02-16 04:46:27','[{"type": "area", "title": "Patient Visits by Reason", "data": [{"day": "Monday", "visits": 50, "reason": "Check-up"}, {"day": "Tuesday", "visits": 60, "reason": "Check-up"}, {"day": "Wednesday", "visits": 40, "reason": "Emergency"}], "metrics": [{"key": "visits", "color": "#4f46e5", "name": "Visits"}, {"key": "reason", "color": "#ff9900", "name": "Reason"}]}, {"type": "bar", "title": "Vital Sign Distribution", "data": [{"name": "Blood Pressure", "value": 80}, {"name": "Heart Rate", "value": 60}, {"name": "Oxygen Saturation", "value": 90}], "metrics": [{"key": "value", "color": "#4f46e5", "name": "Value"}]}]');
INSERT INTO "insight" VALUES(24,'Ecommerce Sales and Revenue Growth','Analyzing sales trends and customer behavior can help identify opportunities for growth and improvement','High',95.0,NULL,'Market demand and customer purchasing behavior','Sales','resolved',NULL,1,'2026-02-16 04:46:27','[{"type": "area", "title": "Sales Trend Analysis", "data": [{"month": "Jan", "sales": 1000}, {"month": "Feb", "sales": 1200}, {"month": "Mar", "sales": 1500}], "metrics": [{"key": "sales", "color": "#4f46e5", "name": "Sales"}]}, {"type": "pie", "title": "Product Category Distribution", "data": [{"name": "Electronics", "value": 40}, {"name": "Fashion", "value": 30}, {"name": "Home Goods", "value": 30}]}]');
INSERT INTO "insight" VALUES(25,'High-Value Customer Insights','The top 10% of customers by total spend account for over 50% of total revenue, indicating a significant opportunity to target high-value customers with personalized marketing campaigns.','High',92.0,NULL,'Customers who spend more tend to have a higher average order value and purchase frequency, making them more valuable to the business.','Marketing','active',NULL,1,'2026-02-16 05:09:00','[{"type": "area", "title": "Customer Spend Trend", "data": [{"name": "Jan", "val": 1000}, {"name": "Feb", "val": 1200}, {"name": "Mar", "val": 1500}], "metrics": [{"key": "val", "color": "#4f46e5", "name": "Total Spend"}]}, {"type": "pie", "title": "Customer Distribution", "data": [{"name": "High-Value", "value": 50}, {"name": "Medium-Value", "value": 30}, {"name": "Low-Value", "value": 20}]}]');
INSERT INTO "insight" VALUES(26,'Optimization of Shipping Operations','The shipping status of orders shows that 20% of orders are delayed, resulting in potential lost sales and damaged customer relationships, highlighting the need for process improvements in shipping operations.','Medium',85.0,NULL,'Inefficient shipping processes and lack of real-time tracking lead to delays, which can be mitigated by implementing more efficient logistics and communication systems.','Operations','active',NULL,1,'2026-02-16 05:09:00','[{"type": "bar", "title": "Shipping Status", "data": [{"name": "On-Time", "val": 80}, {"name": "Delayed", "val": 20}], "metrics": [{"key": "val", "color": "#34C759", "name": "Percentage"}]}, {"type": "area", "title": "Order Fulfillment Rate", "data": [{"name": "Jan", "val": 90}, {"name": "Feb", "val": 85}, {"name": "Mar", "val": 92}], "metrics": [{"key": "val", "color": "#FFC107", "name": "Fulfillment Rate"}]}]');
INSERT INTO "insight" VALUES(27,'Revenue Growth Opportunities','The data shows that the average order value has increased by 15% over the past quarter, indicating a potential opportunity to increase revenue through targeted pricing strategies and product bundling.','High',95.0,NULL,'Customers are willing to pay more for products that meet their needs, and the business can capitalize on this trend by optimizing pricing and offering complementary products.','Sales','active',NULL,1,'2026-02-16 05:09:00','[{"type": "area", "title": "Average Order Value Trend", "data": [{"name": "Q1", "val": 100}, {"name": "Q2", "val": 115}], "metrics": [{"key": "val", "color": "#8E24AA", "name": "Average Order Value"}]}, {"type": "pie", "title": "Product Category Distribution", "data": [{"name": "Category A", "value": 40}, {"name": "Category B", "value": 30}, {"name": "Category C", "value": 30}]}]');
CREATE TABLE organization (
	id INTEGER NOT NULL, 
	name VARCHAR NOT NULL, 
	slug VARCHAR NOT NULL, 
	is_active BOOLEAN, 
	settings JSON, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	updated_at DATETIME, 
	PRIMARY KEY (id)
);
INSERT INTO "organization" VALUES(1,'','h3w-default',1,'{"verbosity": "Balanced", "conservative": true, "realtime": false, "notifications": true}','2026-02-15 14:54:51','2026-02-15 14:59:43');
CREATE TABLE user (
	id INTEGER NOT NULL, 
	full_name VARCHAR, 
	email VARCHAR NOT NULL, 
	hashed_password VARCHAR NOT NULL, 
	is_active BOOLEAN, 
	is_superuser BOOLEAN, 
	organization_id INTEGER, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	updated_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(organization_id) REFERENCES organization (id)
);
INSERT INTO "user" VALUES(1,NULL,'admin@h3w.com','$pbkdf2-sha256$29000$L.U8Z.xdS0nJee/de0/pnQ$6GmpCKNUCfH9RXD68rxj4OiJGQw/Xp3FyGhdkmBPLJw',1,1,1,'2026-02-15 14:54:51',NULL);
CREATE INDEX ix_organization_name ON organization (name);
CREATE INDEX ix_organization_id ON organization (id);
CREATE UNIQUE INDEX ix_organization_slug ON organization (slug);
CREATE INDEX ix_user_full_name ON user (full_name);
CREATE INDEX ix_user_id ON user (id);
CREATE UNIQUE INDEX ix_user_email ON user (email);
CREATE INDEX ix_data_source_id ON data_source (id);
CREATE INDEX ix_data_source_name ON data_source (name);
CREATE INDEX ix_insight_id ON insight (id);
CREATE INDEX ix_insight_title ON insight (title);
COMMIT;
