function Widget() {
  return (
    <div className="max-w-[340px] hidden xl:inline">
      <div className="scale-[0.85] origin-top-left w-[400px] h-[927px]">
        <iframe
          // src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FMeta&tabs=timeline&width=340&height=790&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
          title="Facebook Widget"
          className="w-full h-full"
          allow="encrypted-media; fullscreen"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
}

export default Widget;
