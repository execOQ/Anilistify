function page(regex, href = false) {
    return regex.test(href ? window.location.href : window.location.pathname);
}

export default page;