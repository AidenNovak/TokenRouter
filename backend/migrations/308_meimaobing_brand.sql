-- 没猫饼品牌层：只更新仍使用上游默认名的展示设置，管理员自定义的品牌内容保持不变。
INSERT INTO settings (key, value, updated_at)
VALUES ('site_name', '没猫饼', NOW())
ON CONFLICT (key) DO NOTHING;

UPDATE settings
SET value = '没猫饼', updated_at = NOW()
WHERE key = 'site_name' AND value = 'TokenRouter';

UPDATE settings
SET value = '没猫饼', updated_at = NOW()
WHERE key IN ('smtp_from_name', 'payment_product_name_prefix')
  AND value = 'TokenRouter';

-- 站点文案分组同时保存源语言与英文译文；仅当源文案仍是上游默认名时改写。
UPDATE settings
SET value = jsonb_set(
        jsonb_set(value::jsonb, '{site_name,source}', to_jsonb('没猫饼'::text)),
        '{site_name,translations,en}',
        '{"value": "Meimaobing", "source_revision": 1}'::jsonb
    )::text,
    updated_at = NOW()
WHERE key = 'site_texts'
  AND value ~ '^[[:space:]]*\{'
  AND value::jsonb->'site_name'->>'source' = 'TokenRouter';
