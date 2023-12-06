document.addEventListener('DOMContentLoaded', function () {
    const postForm = document.getElementById('postForm');
    const postsContainer = document.getElementById('posts');

    postForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        createPost({ title, content });
    });

    // 초기 게시글 로드
    loadPosts();

    // 게시글 생성
    function createPost(postData) {
        fetch('/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 게시글 생성 후 목록 다시 로드
                loadPosts();
                // 입력된 내용 초기화
                document.getElementById('title').value = '';
                document.getElementById('content').value = '';
            } else {
                console.error(data.message);
            }
        })
        .catch(error => console.error(error));
    }


    // 게시글 불러오기
    function loadPosts() {
        fetch('/posts')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayPosts(data.posts);
            } else {
                console.error(data.message);
            }
        })
        .catch(error => console.error(error));
    }

    // 게시글 표시
    function displayPosts(posts) {
        postsContainer.innerHTML = '';

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.dataset.id = post.id;

            const titleElement = document.createElement('h3');
            titleElement.className = 'post-title';
            titleElement.textContent = post.title;

            const contentElement = document.createElement('p');
            contentElement.className = 'post-content';
            contentElement.textContent = post.content;

            const editButton = document.createElement('button');
            editButton.className = 'edit-button';
            editButton.textContent = '수정';
            editButton.addEventListener('click', function () {
                editPost(post.id, post.title, post.content);
            });

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.textContent = '삭제';
            deleteButton.addEventListener('click', function () {
                deletePost(post.id);
            });

            postElement.appendChild(titleElement);
            postElement.appendChild(contentElement);
            postElement.appendChild(editButton);
            postElement.appendChild(deleteButton);

            postsContainer.appendChild(postElement);
        });
    }

    // 게시글 수정
    function editPost(id, currentTitle, currentContent) {
        const newTitle = prompt('수정할 제목:', currentTitle);
        const newContent = prompt('수정할 내용:', currentContent);

        if (newTitle !== null && newContent !== null) {
            fetch(`/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: newTitle, content: newContent }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadPosts(); // 게시글 수정 후 목록 다시 로드
                } else {
                    console.error(data.message);
                }
            })
            .catch(error => console.error(error));
        }
    }

    // 게시글 삭제
    function deletePost(id) {
        const confirmDelete = confirm('정말로 삭제하시겠습니까?');

        if (confirmDelete) {
            fetch(`/posts/${id}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadPosts(); // 게시글 삭제 후 목록 다시 로드
                } else {
                    console.error(data.message);
                }
            })
            .catch(error => console.error(error));
        }
    }
});
