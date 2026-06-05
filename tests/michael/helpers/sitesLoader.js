// 職責：呼叫 API，分頁抓取所有 site 的 { name, hashId }
<<<<<<< HEAD
export async function fetchAllSites(page, baseURL, loadSize = 10) {
=======
export async function fetchAllSites(page, baseURL, loadSize = 50) {
>>>>>>> michael
    const sites = [];
    const API_URL = `/rest/sites?_branch=search&name=&status=Y&page={PAGE}&size=${loadSize}&sort=-create_time,%20id`; // 假設每頁 10 筆，根據實際情況調整
    let pageIndex = 0;
    let hasMore = true;

    while (hasMore) {
        // 透過 page.evaluate 或直接 fetch 呼叫 API
        const url = `${baseURL}${API_URL.replace('{PAGE}', String(pageIndex))}`;
        const res = await page.evaluate(async (url) => {
            const r = await fetch(url, { credentials: 'include' });
            return r.json();
        }, url);

        const batch = res.data ?? [];
        sites.push(...batch.map((s, i) => ({
            id: sites.length + i + 1,
            name: s.name,
            hashId: s.hashId
        })));
<<<<<<< HEAD

=======
>>>>>>> michael
        console.log(`第 ${pageIndex} 頁取得 ${batch.length} 筆，累計 ${sites.length} 筆`);

        hasMore = batch.length === loadSize;
        pageIndex++;
    }
<<<<<<< HEAD
=======
    console.log(`共找到 ${sites.length} 個 site`);
>>>>>>> michael
    return sites; // [{ name, hashId }, ...]
}