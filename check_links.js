async function test() {
  const blogRes = await fetch('http://localhost:3000/gu/blog');
  const blogText = await blogRes.text();
  const blogMatches = blogText.match(/\/gu\/blog\/[^"'\s<>]+/g);
  console.log('Blog matches on /gu/blog:', blogMatches);

  const prayersRes = await fetch('http://localhost:3000/gu/prayers');
  const prayersText = await prayersRes.text();
  const prayerMatches = prayersText.match(/\/gu\/prayers\/[^"'\s<>]+/g);
  console.log('Prayer matches on /gu/prayers:', prayerMatches);

  if (blogMatches && blogMatches[0]) {
    const postRes = await fetch('http://localhost:3000' + blogMatches[0]);
    console.log('First blog post response status:', postRes.status, blogMatches[0]);
  }

  if (prayerMatches && prayerMatches[0]) {
    const pRes = await fetch('http://localhost:3000' + prayerMatches[0]);
    console.log('First prayer response status:', pRes.status, prayerMatches[0]);
  }
}
test();
