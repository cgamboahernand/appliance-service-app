import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ChatWidgetComponent } from './chat-widget';

describe('ChatWidgetComponent', () => {
  let component: ChatWidgetComponent;
  let fixture: ComponentFixture<ChatWidgetComponent>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatWidgetComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ChatWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTesting.match(() => true); // drain any pending requests
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with panel closed', () => {
    expect(component.isOpen()).toBe(false);
  });

  it('should render FAB button', () => {
    const fab = fixture.nativeElement.querySelector('.chat-fab');
    expect(fab).toBeTruthy();
  });

  it('should not render panel when closed', () => {
    const panel = fixture.nativeElement.querySelector('.chat-panel');
    expect(panel).toBeNull();
  });

  it('should open panel on toggle', () => {
    component.toggle();
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('.chat-panel');
    expect(panel).toBeTruthy();
    expect(component.isOpen()).toBe(true);
  });

  it('should close panel on second toggle', () => {
    component.toggle();
    component.toggle();
    fixture.detectChanges();

    expect(component.isOpen()).toBe(false);
    const panel = fixture.nativeElement.querySelector('.chat-panel');
    expect(panel).toBeNull();
  });

  it('should close panel via close()', () => {
    component.toggle();
    fixture.detectChanges();
    expect(component.isOpen()).toBe(true);

    component.close();
    fixture.detectChanges();
    expect(component.isOpen()).toBe(false);
  });

  it('should show empty state greeting when no messages', () => {
    component.toggle();
    fixture.detectChanges();

    const empty = fixture.nativeElement.querySelector('.chat-empty');
    expect(empty).toBeTruthy();
    expect(empty.textContent).toContain('Hi!');
  });

  it('should add user message on send', () => {
    component.toggle();
    component.inputText = 'Hello';
    component.send();
    fixture.detectChanges();

    const bubbles = fixture.nativeElement.querySelectorAll('.bubble-user');
    expect(bubbles.length).toBe(1);
    expect(bubbles[0].textContent).toContain('Hello');
  });

  it('should clear input after send', () => {
    component.toggle();
    component.inputText = 'Hello';
    component.send();
    expect(component.inputText).toBe('');
  });

  it('should not send empty messages', () => {
    component.inputText = '   ';
    component.send();
    expect(component.messages().length).toBe(0);
  });

  it('should show typing indicator after sending', () => {
    component.toggle();
    component.inputText = 'Help me';
    component.send();
    fixture.detectChanges();

    expect(component.isTyping()).toBe(true);
    const typing = fixture.nativeElement.querySelector('.typing');
    expect(typing).toBeTruthy();

    // Flush the HTTP request to simulate backend response
    const req = httpTesting.expectOne((r) => r.url.includes('/api/chat'));
    req.flush({ message: 'I can help with that!' });
    fixture.detectChanges();

    expect(component.isTyping()).toBe(false);
  });

  it('should add assistant response after API reply', () => {
    component.toggle();
    component.inputText = 'My fridge is broken';
    component.send();
    fixture.detectChanges();

    const req = httpTesting.expectOne((r) => r.url.includes('/api/chat'));
    req.flush({ message: 'Let me help you with that.' });
    fixture.detectChanges();

    expect(component.messages().length).toBe(2);
    expect(component.messages()[1].role).toBe('assistant');
    expect(component.messages()[1].content).toBe('Let me help you with that.');
  });

  it('should hide empty state after sending a message', () => {
    component.toggle();
    component.inputText = 'Test';
    component.send();
    fixture.detectChanges();

    const req = httpTesting.expectOne((r) => r.url.includes('/api/chat'));
    req.flush({ message: 'Response' });
    fixture.detectChanges();

    const empty = fixture.nativeElement.querySelector('.chat-empty');
    expect(empty).toBeNull();
  });

  it('should send on Enter key', () => {
    component.toggle();
    component.inputText = 'Enter test';
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    Object.defineProperty(event, 'shiftKey', { value: false });
    const spy = vi.spyOn(event, 'preventDefault');

    component.onKeydown(event);
    expect(spy).toHaveBeenCalled();
    expect(component.messages().length).toBe(1);
  });

  it('should not send on Shift+Enter', () => {
    component.inputText = 'Should not send';
    const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true });
    component.onKeydown(event);
    expect(component.messages().length).toBe(0);
  });

  it('should preserve messages when panel is closed and reopened', () => {
    component.toggle();
    component.inputText = 'Remember me';
    component.send();
    fixture.detectChanges();

    const req = httpTesting.expectOne((r) => r.url.includes('/api/chat'));
    req.flush({ message: 'I will remember!' });
    fixture.detectChanges();

    component.close();
    fixture.detectChanges();

    component.toggle();
    fixture.detectChanges();

    const bubbles = fixture.nativeElement.querySelectorAll('.chat-bubble:not(.typing)');
    expect(bubbles.length).toBe(2);
  });

  it('should render close button in header', () => {
    component.toggle();
    fixture.detectChanges();

    const closeBtn = fixture.nativeElement.querySelector('.chat-close');
    expect(closeBtn).toBeTruthy();
    closeBtn.click();
    fixture.detectChanges();
    expect(component.isOpen()).toBe(false);
  });

  it('should disable send button when input is empty', () => {
    component.toggle();
    component.inputText = '';
    fixture.detectChanges();

    const sendBtn = fixture.nativeElement.querySelector('.send-btn') as HTMLButtonElement;
    expect(sendBtn.disabled).toBe(true);
  });

  it('should show error message when API call fails', () => {
    component.toggle();
    component.inputText = 'Hello';
    component.send();
    fixture.detectChanges();

    const req = httpTesting.expectOne((r) => r.url.includes('/api/chat'));
    req.error(new ProgressEvent('error'));
    fixture.detectChanges();

    expect(component.messages().length).toBe(2);
    expect(component.messages()[1].role).toBe('assistant');
    expect(component.messages()[1].content).toContain('error');
    expect(component.isTyping()).toBe(false);
  });

  it('should not allow sending while typing indicator is shown', () => {
    component.toggle();
    component.inputText = 'First message';
    component.send();
    fixture.detectChanges();

    expect(component.isTyping()).toBe(true);

    component.inputText = 'Second message';
    component.send();

    // Only one HTTP request should have been made
    const reqs = httpTesting.match((r) => r.url.includes('/api/chat'));
    expect(reqs.length).toBe(1);
    expect(component.messages().length).toBe(1); // only the first user message
  });
});
