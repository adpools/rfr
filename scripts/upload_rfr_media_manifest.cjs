/**
 * RFR BY RIYAS — Supabase Storage Media Uploader & Verifier
 * 
 * Safely uploads the 39 canonical local assets from public/ into root folders in 'rfr-media'.
 * 
 * Safety & Integrity:
 * 1. Root Folders: press/, clients/, influencers/, portfolio/, branding/.
 * 2. Strict upsert: false (never overwrites or deletes existing files or variants).
 * 3. Never uses anon key for upload. Requires authenticated admin session or service_role key.
 * 4. Never exposes secret key in frontend code.
 * 5. Includes missing press image (WhatsApp Image 2026-11-06...).
 * 6. Uses canonical influencer files (deepamol.jpg, rudiya.jpg 863KB, sahalini-sharma.jpg 283KB).
 * 7. Verifies live objects in Supabase post-upload and outputs detailed audit report.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://hlyxzhafdjyflwcdecmp.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL || 'advriyas@gmail.com';
const adminPassword = process.env.ADMIN_PASSWORD;
const anonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_T6XDfhlBwk8zVy4BEaGYFQ_0uhAeeCE';

const manifest = [
  // 1. Press (18 files)
  { local: 'public/news and press/WhatsApp Image 2026-11-06 at 10.53.08 AM (1).jpeg', remote: 'press/WhatsApp Image 2026-11-06 at 10.53.08 AM (1).jpeg', mime: 'image/jpeg' },
  { local: 'public/news and press/WhatsApp Image 2026-11-04 at 9.41.04 PM.jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.41.04 PM.jpeg', mime: 'image/jpeg' },
  { local: 'public/news and press/WhatsApp Image 2026-11-04 at 9.42.10 PM (1).jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.42.10 PM (1).jpeg', mime: 'image/jpeg' },
  { local: 'public/news and press/WhatsApp Image 2026-11-04 at 9.41.05 PM (1).jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.41.05 PM (1).jpeg', mime: 'image/jpeg' },
  { local: 'public/news and press/WhatsApp Image 2026-11-04 at 9.42.11 PM.jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.42.11 PM.jpeg', mime: 'image/jpeg' },
  { local: 'public/news and press/WhatsApp Image 2026-11-04 at 9.41.06 PM (1).jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.41.06 PM (1).jpeg', mime: 'image/jpeg' },
  { local: 'public/news and press/WhatsApp Image 2026-11-04 at 9.41.04 PM (1).jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.41.04 PM (1).jpeg', mime: 'image/jpeg' },
  { local: 'public/news and press/WhatsApp Image 2026-11-04 at 9.42.08 PM (1).jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.42.08 PM (1).jpeg', mime: 'image/jpeg' },
  { local: 'public/news and press/WhatsApp Image 2026-11-04 at 9.41.05 PM.jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.41.05 PM.jpeg', mime: 'image/jpeg' },
  { local: 'public/news and press/WhatsApp Image 2026-11-04 at 9.41.06 PM (2).jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.41.06 PM (2).jpeg', mime: 'image/jpeg' },
  { local: 'public/news and press/WhatsApp Image 2026-11-04 at 9.41.07 PM (1).jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.41.07 PM (1).jpeg', mime: 'image/jpeg' },
  { local: 'public/news and press/WhatsApp Image 2026-11-04 at 9.41.07 PM.jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.41.07 PM.jpeg', mime: 'image/jpeg' },
  { local: 'public/news and press/WhatsApp Image 2026-11-04 at 9.41.08 PM.jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.41.08 PM.jpeg', mime: 'image/jpeg' },
  { local: 'public/news and press/WhatsApp Image 2026-11-04 at 9.41.09 PM.jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.41.09 PM.jpeg', mime: 'image/jpeg' },
  { local: 'public/news and press/WhatsApp Image 2026-11-04 at 9.42.11 PM (1).jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.42.11 PM (1).jpeg', mime: 'image/jpeg' },
  { local: 'public/news and press/WhatsApp Image 2026-11-04 at 9.42.11 PM (2).jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.42.11 PM (2).jpeg', mime: 'image/jpeg' },
  { local: 'public/news and press/WhatsApp Image 2026-11-04 at 9.42.14 PM.jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.42.14 PM.jpeg', mime: 'image/jpeg' },
  { local: 'public/news and press/WhatsApp Image 2026-11-04 at 9.46.07 PM.jpeg', remote: 'press/WhatsApp Image 2026-11-04 at 9.46.07 PM.jpeg', mime: 'image/jpeg' },
  
  // 2. Clients (6 files)
  { local: 'public/images/clients/citroen.png', remote: 'clients/citroen.png', mime: 'image/png' },
  { local: 'public/images/clients/jeep.png', remote: 'clients/jeep.png', mime: 'image/png' },
  { local: 'public/images/clients/skoda.png', remote: 'clients/skoda.png', mime: 'image/png' },
  { local: 'public/images/clients/rb.png', remote: 'clients/rb.png', mime: 'image/png' },
  { local: 'public/images/clients/max.png', remote: 'clients/max.png', mime: 'image/png' },
  { local: 'public/images/clients/tic.png', remote: 'clients/tic.png', mime: 'image/png' },
  
  // 3. Influencers (7 canonical files)
  { local: 'public/images/influencers/deepamol.jpg', remote: 'influencers/deepamol.jpg', mime: 'image/jpeg' },
  { local: 'public/images/influencers/malavika.jpg', remote: 'influencers/malavika.jpg', mime: 'image/jpeg' },
  { local: 'public/images/influencers/rhea-george.jpg', remote: 'influencers/rhea-george.jpg', mime: 'image/jpeg' },
  { local: 'public/images/influencers/rudiya.jpg', remote: 'influencers/rudiya.jpg', mime: 'image/jpeg' }, // 863,013 B
  { local: 'public/images/influencers/sahalini-sharma.jpg', remote: 'influencers/sahalini-sharma.jpg', mime: 'image/jpeg' }, // 283,269 B
  { local: 'public/images/influencers/shikha-santhosh.jpg', remote: 'influencers/shikha-santhosh.jpg', mime: 'image/jpeg' },
  { local: 'public/images/influencers/thara-anitha-mathew.jpg', remote: 'influencers/thara-anitha-mathew.jpg', mime: 'image/jpeg' },
  
  // 4. Portfolio (4 files)
  { local: 'public/images/thumbnails/17xhWbUtxJePM8igOO7VADLDfiqcG6S04.jpg', remote: 'portfolio/17xhWbUtxJePM8igOO7VADLDfiqcG6S04.jpg', mime: 'image/jpeg' },
  { local: 'public/images/thumbnails/1GEWSZYSU8qQKNW05-dSMkmuUBd2AbOhV.jpg', remote: 'portfolio/1GEWSZYSU8qQKNW05-dSMkmuUBd2AbOhV.jpg', mime: 'image/jpeg' },
  { local: 'public/images/thumbnails/1agM4IPcwpZHfsXjbA-o8SfP4kkpPW1t_.jpg', remote: 'portfolio/1agM4IPcwpZHfsXjbA-o8SfP4kkpPW1t_.jpg', mime: 'image/jpeg' },
  { local: 'public/images/thumbnails/1dy6TIwofRd4bWLMrdHeiykYkqTVbFIFw.jpg', remote: 'portfolio/1dy6TIwofRd4bWLMrdHeiykYkqTVbFIFw.jpg', mime: 'image/jpeg' },
  
  // 5. Branding (4 files)
  { local: 'public/images/riyas.jpg', remote: 'branding/riyas.jpg', mime: 'image/jpeg' },
  { local: 'public/images/final bro.png', remote: 'branding/final bro.png', mime: 'image/png' },
  { local: 'public/images/pothys.png', remote: 'branding/pothys.png', mime: 'image/png' },
  { local: 'public/favicon.png', remote: 'branding/favicon.png', mime: 'image/png' } // Canonical 32x32 PNG favicon
];

async function main() {
  console.log('================================================================');
  console.log('RFR BY RIYAS — SUPABASE STORAGE ASSET UPLOADER & VERIFIER');
  console.log('Target Project:', supabaseUrl);
  console.log('Target Bucket:  rfr-media');
  console.log('================================================================\n');

  let client;
  if (serviceRoleKey) {
    console.log('[AUTH] Authenticated via SUPABASE_SERVICE_ROLE_KEY (Service Role)');
    client = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  } else if (adminPassword) {
    console.log(`[AUTH] Authenticating as administrator: ${adminEmail}`);
    client = createClient(supabaseUrl, anonKey);
    const { data: authData, error: authError } = await client.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });
    if (authError || !authData.session) {
      console.error('[FATAL] Admin sign-in failed:', authError ? authError.message : 'No session returned');
      process.exit(1);
    }
    console.log('[AUTH] Admin session established successfully.');
  } else {
    console.error('================================================================');
    console.error('[ACCESS DENIED] AUTHENTICATED CREDENTIALS REQUIRED');
    console.error('================================================================');
    console.error('The storage.objects table has Row-Level Security (RLS) enabled.');
    console.error('Policy "Admins can upload media files" strictly requires an authenticated admin session.');
    console.error('Anonymous/publishable key writes are rejected with 403 AccessDenied.');
    console.error('\nTo perform the upload, provide either:');
    console.error('  1. $env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"');
    console.error('     (Found in Supabase Dashboard -> Project Settings -> API -> service_role)');
    console.error('  OR');
    console.error('  2. $env:ADMIN_PASSWORD="your-admin-password"');
    console.error('     (For administrator: advriyas@gmail.com)');
    console.error('\nThen re-run:');
    console.error('  node scripts/upload_rfr_media_manifest.cjs');
    process.exit(1);
  }

  const results = {
    successful: [],
    failed: [],
    skippedExisting: [],
    missingLocal: []
  };

  for (let i = 0; i < manifest.length; i++) {
    const item = manifest[i];
    const fullLocalPath = path.resolve(__dirname, '..', item.local);

    if (!fs.existsSync(fullLocalPath)) {
      console.error(`[${i + 1}/${manifest.length}] MISSING LOCAL: ${item.local}`);
      results.missingLocal.push(item);
      continue;
    }

    const fileBuffer = fs.readFileSync(fullLocalPath);

    console.log(`[${i + 1}/${manifest.length}] Uploading to root: ${item.remote} (${fileBuffer.length} bytes)...`);

    const { data, error } = await client.storage
      .from('rfr-media')
      .upload(item.remote, fileBuffer, {
        contentType: item.mime,
        upsert: false // Strict requirement: never overwrite
      });

    if (error) {
      if (error.message && error.message.includes('already exists')) {
        console.log(`  -> SKIPPED (Already exists in root)`);
        results.skippedExisting.push({ ...item, reason: error.message });
      } else {
        console.error(`  -> FAILED: ${error.message}`);
        results.failed.push({ ...item, error: error.message });
      }
    } else {
      console.log(`  -> SUCCESS: ${item.remote}`);
      results.successful.push({ ...item, data });
    }
  }

  console.log('\n================================================================');
  console.log('POST-UPLOAD LIVE BUCKET VERIFICATION AUDIT');
  console.log('================================================================\n');

  const folders = ['press', 'clients', 'influencers', 'portfolio', 'branding'];
  let verifiedCount = 0;

  for (const folder of folders) {
    const { data: remoteFiles, error: listError } = await client.storage.from('rfr-media').list(folder, { limit: 100 });
    if (listError) {
      console.error(`Failed to list root folder "${folder}":`, listError.message);
    } else {
      console.log(`Root Folder "${folder}/": ${remoteFiles.length} objects`);
      for (const f of remoteFiles) {
        if (f.id) {
          verifiedCount++;
          console.log(`  [VERIFIED] ${folder}/${f.name} (${f.metadata?.size || 'unknown'} bytes)`);
        }
      }
    }
  }

  console.log('\n================================================================');
  console.log(`FINAL RESULT: ${verifiedCount} objects verified in root folders.`);
  console.log('================================================================');
}

main().catch(err => {
  console.error('[FATAL EXCEPTION]', err);
  process.exit(1);
});
