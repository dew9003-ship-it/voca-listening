import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// 1. Supabase 설정 한 군데서 관리
export const supabase = createClient(
    'https://uuzhdxangctewuklvmlv.supabase.co',
    'sb_publishable_vv0I9z-5PnmOabrpVspufQ_ABmB_F-F'
);

// 2. 모든 페이지 공통 보안 설정 (복사/붙여넣기 차단)
export function initSecurity(inputEl = null) {
    document.addEventListener('copy', (e) => e.preventDefault());
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    
    if (inputEl) {
        inputEl.addEventListener('paste', (e) => {
            e.preventDefault();
            showAlert('주의', '직접 입력해야 학습 효과가 좋습니다! (붙여넣기 금지)', true);
        });
        inputEl.addEventListener('drop', (e) => e.preventDefault());
    }
}

// 3. 통일된 알림창 로직 (HTML이 없어도 자동으로 생성)
export let modalConfirmAction = null;

export function showAlert(title, msg, isError = false, onConfirm = null) {
    let overlay = document.getElementById('globalModalOverlay');
    
    // 모달 HTML이 없으면 자동으로 생성해서 삽입
    if (!overlay) {
        document.body.insertAdjacentHTML('beforeend', `
            <div id="globalModalOverlay">
                <div class="modal-content">
                    <h3 id="modalTitle" class="modal-title"></h3>
                    <p id="modalMsg" class="modal-msg"></p>
                    <button id="modalYes" class="modal-btn" style="background:#4caf50; color:white;">확인</button>
                    <button id="modalNo" class="modal-btn" style="background:#f1f5f9; color:#475569; display:none;">목록으로</button>
                </div>
            </div>
        `);
        overlay = document.getElementById('globalModalOverlay');
        document.getElementById('modalYes').onclick = () => {
            overlay.style.display = 'none';
            if (modalConfirmAction) modalConfirmAction();
        };
    }

    const titleEl = document.getElementById('modalTitle');
    titleEl.textContent = title;
    titleEl.style.color = isError ? '#ef4444' : '#1f2937';
    document.getElementById('modalMsg').textContent = msg;
    
    modalConfirmAction = onConfirm;
    overlay.style.display = 'flex';
}

// 4. 공통 권한 체크
export async function checkAuth() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
        location.href = 'login.html';
        return null;
    }
    return data.user;
}
