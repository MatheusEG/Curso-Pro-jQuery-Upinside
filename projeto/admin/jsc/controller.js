jQuery(function($) { 
	var link = 'swith/painel.php';
	
	//fecha ajaxdial
	$('.dialog').on('click', '.j_dialclose', function(){
		if($(this).hasClass('update')){
			window.location.reload();
			return false;
		}
		$(this).parent().fadeOut('fast');
		return false;
	});
	
	//abre dialogo
	function myDial(tipo, content, pageUpdate = null){
		var classUpdate;
		if(pageUpdate){
			classUpdate = 'update';
		}
		var title = (tipo == 'accept' ? 'Sucesso: ': (tipo == 'error' ? 'Ops: ': (tipo == 'alert' ? 'Atenção: ': 'null')));
		if(title == 'null'){
			alert('Tipo invalido');
		}else{
			$('.ajaxmsg').attr('class', 'ajaxmsg msg');
			$('.ajaxmsg').addClass(tipo).html(
				'<strong class="tt">'+title+'</strong>'+
				'<p>'+content+'</p>'+
				'<a href="#" class="closedial j_dialclose '+classUpdate+'">X FECHAR</a>'
			).fadeIn('fast');
		}
	}

	//fecha modal
	$('.dialog').on('click', '.closedial, .closemodal', function(){
		if($(this).hasClass('j_dialclose')){
			return false;
		}
		$(this).parent().fadeOut('fast',function(){
			$('.dialog').fadeOut('fast');
		});
		return false;
	});

	//Abre modal
	function myModal(tipo, content){
		var title = (tipo == 'accept' ? 'Sucesso: ': (tipo == 'error' ? 'Ops: ': (tipo == 'alert' ? 'Atenção: ': 'null')));
		if(title == 'null'){
			alert('Tipo invalido');
		}else{
			$('.dialog').fadeIn('fast', function(){
				$('.ajaxmsg').attr('class', 'ajaxmsg msg');
				$('.ajaxmsg').addClass(tipo).html(
					'<strong class="tt">'+title+'</strong>'+
        			'<p>'+content+'</p>'+
    				'<a href="#" class="closedial">X FECHAR</a>'
				).fadeIn('fast');
			});
		}
	}

	//CUSTOM
	$('.controle .li').mouseenter(function(){
		$(this).find('.submenu').slideDown("fast", stop());
	}).mouseleave(function(){
		$(this).find('.submenu').slideUp("fast", stop());
	});

    function stop(){
        $('.submenu').stop(true, true);
    }

	$('.j_addpost').click(function(){
		$('.dialog').fadeIn("fast", function(){
			$('.newpost').fadeIn('fast');
		});		
		return false;	
	});

	/*$('form').submit(function(){
		myModal( 'accept', 'Teste de modal');
		return false;
	});*/

	//USUARIOS
	$('.j_adduser').click(function(){
		$('.dialog').fadeIn('fast',function(){
			$('.newuser').fadeIn('slow');
		});
		return false;
	});
	$('.j_close_newuser').click(function(){
		window.location.reload();
		return false;
	});

	//CATEGRIAS
	$('.j_addcat').click(function(){
		$('.dialog').fadeIn("fast", function(){
			$('.newcat').fadeIn('fast');
		});
		return false;	
	});

	//CADASTRA CATEGORIA
	$('form[name="cadnewcat"]').submit(function(){
		var forma = $(this);
		var dados = 'acao=categoria_cadastro&' + $(this).serialize();
		
		$.ajax({
			url: link,
			data: dados,
			type: 'POST',
			beforeSend: function(){
				forma.find('.load').fadeIn('fast');
			},
			success: function(resposta){
				if(resposta == 0){
					myDial('alert', 'O nome deve ser preenchido!');
				}else if(resposta == 'errIsset'){
					myDial('alert', 'Categoria já existe');
				}else{
					myDial('accept', 'Cadastro efetuado com sucesso!');
					window.setTimeout(function(){
						$(location).attr('href', 'dashboard.php?exe=categorias/edit&catid='+ resposta);
					}, 1000);
				}
			},
			complete: function(){
				forma.find('.load').fadeOut('fast');
			},
			error: function(){
				alert('Error');
			}
		});	
		return false;
	});
	
	//CADASTRA USUARIOS
	$('form[name="cadnewuser"]').submit(function(){
		var forma = $(this);
		var dados = 'acao=user_create&' + $(this).serialize();
		$.ajax({
			url: link,
			data: dados,
			type: 'POST',
			beforeSend: function(){
				forma.find('.load').fadeIn('fast');
			},
			success: function(resposta){
				console.log(resposta);
				if(resposta == 0){
					myDial('alert', 'Preencha todos os campos!');
				}else if(resposta == 1){
					myDial('alert', 'E-mail invalido!');
				}else if(resposta == 2){
					myDial('alert', 'E-mail já cadastrado!');
				}else if(resposta == 3){
					myDial('alert', 'Login já cadastrado!');
				}else if(resposta == 4){
					myDial('error', 'Erro no servidor, tente novamente mais tarte!');
				}else{
					myDial('accept', 'Usuario <strong>'+resposta+'</strong> cadastrado', 'update');
				}
			},
			complete: function(){
				forma.find('.load').fadeOut('fast');
			},
			error: function(){
				alert('Error');
			}
		});	
		return false;
	});

	//EDITAR USUARIOS
	$('.j_userEdit').click(function(){
		var userId = $(this).parent().parent().attr('id');
		var forma = $(this);
		var dados = 'acao=user_read&userId='+userId;
		$.ajax({
			url: link,
			data: dados,
			type: 'POST',
			dataType: "json",
			success: function(resposta){
				$('.dialog').fadeIn('fast',function(){
					console.log(resposta[0]['cadastro']);
					$('form[name="ediUser"] option[value="'+resposta[0]['nivel']+'"]').attr('selected','selected');
					$('form[name="ediUser"] input[name="nome"]').val(resposta[0]['nome']);
					$('form[name="ediUser"] input[name="email"]').val(resposta[0]['email']);
					$('form[name="ediUser"] input[name="login"]').val(resposta[0]['login']);
					$('form[name="ediUser"] input[name="senha"]').val(resposta[0]['senha']);
					$('form[name="ediUser"] input[name="id"]').val(resposta[0]['id']);
					$('.edituser').fadeIn('slow');
				});
			}
		});	
		return false;
	});

	//EDITA USUARIOS
	$('form[name="ediUser"]').submit(function(){
		var forma = $(this);
		var dados = 'acao=user_update&' + $(this).serialize();

		$.ajax({
			url: link,
			data: dados,
			type: 'POST',
			beforeSend: function(){
				forma.find('.load').fadeIn('fast');
			},
			success: function(resposta){
				console.log(resposta);
				if(resposta == 0){
					myDial('alert', 'Preencha todos os campos!');
				}else if(resposta == 1){
					myDial('alert', 'E-mail invalido!');
				}else if(resposta == 2){
					myDial('alert', 'E-mail já cadastrado!');
				}else if(resposta == 3){
					myDial('alert', 'Login já cadastrado!');
				}else if(resposta == 4){
					myDial('error', 'Erro no servidor, tente novamente mais tarte!');
				}else{
					myDial('accept', 'Usuario <strong>'+resposta+'</strong> atualizado', 'update');
				}
			},
			complete: function(){
				forma.find('.load').fadeOut('fast');
			},
			error: function(){
				alert('Error');
			}
		});	
		return false;
	});


	//DELETA USUARIOS
	$('.j_userDelete').click(function(){
		var userId = $(this).parent().parent().attr('id');
		var idAtual = $('.userCode').attr('id');
		var dados = 'acao=user_delete&deleteId=' +userId+ '&idAtual=' +idAtual;
		
		$.ajax({
			url: link,
			data: dados,
			type: 'POST',
			beforeSend: function(){
				$('.usuarios .users li[id="'+userId+'"]').css('background','red');
			},
			success: function(resposta){
				if(resposta == 'autoDelete'){
					myModal('error', 'Não é possível apagar o próprio usuario');
				}else if(resposta == '1'){
					myModal('accept', 'Usuario deletado com sucesso');
					$('.usuarios .users li[id="'+userId+'"]').fadeOut('slow');
				}
			},
			complete: function(){
				$('.usuarios .users li[id="'+userId+'"]').css('background','#FFF');
			},
			error: function(){
				alert('Error');
			}
		});
		return false;
	});
	//CONFIGURACAO
	$('.configs .abas_config li a').click(function(){
		$('.configs .abas_config li a').removeClass('active');
		$(this).addClass('active');
		
		var formGo = $(this).attr('href');
		
		$('.configs form[name!="'+formGo+'"]').fadeOut('fast', function(){
			$('.configs form[name="'+formGo+'"]').fadeIn('fast');
		});
		return false;
	});

	//MANUTENÇÃO
	$('form[name="config_manutencao"]').submit(function(){
		return false;
	});

	$('.j_config_manutencao_no').click(function(){
		$.ajax({
			url: link,
			type: 'POST',
			data:'acao=manutencaoDesativa',
			beforeSend: function(){
				$('fieldset .main .load').fadeIn('fast');
			},
			success:function(resposta){
				$('.j_config_manutencao_no').parent().fadeOut('fast', function(){
					$(this).parent().children().eq(2).fadeIn('fast');
				});
			},
			complete: function(){
				$('fieldset .main .load').fadeOut('fast');
			},
			error: function(){
				alert('error');
			}
		});
	});

	$('.j_config_manutencao_yes').click(function(){
		$.ajax({
			url: link,
			type: 'POST',
			data:'acao=manutencaoAtiva',
			beforeSend: function(){
				$('fieldset .main .load').fadeIn('fast');
			},
			success:function(resposta){
				$('.j_config_manutencao_yes').parent().fadeOut('fast', function(){
					console.table($(this).parent().children().eq(1).fadeIn('fast'));
					$(this).parent().children().eq(1).fadeIn('fast');
				});
			},
			complete: function(){
				$('fieldset .main .load').fadeOut('fast');
			},
			error: function(){
				alert('error');
			}
		});
	});

	//SERVIDOR DE EMAIL 
	$('form[name=config_email]').submit(function(){
		var forma = $(this);
		var dados = 'acao=mailserver_atualiza&' + $(this).serialize();
		$.ajax({
			url: link,
			data: dados,
			type: 'POST',
			beforeSend: function(){
				forma.find('.load').fadeIn('fast');
			},
			success: function(resposta){
				if(resposta == 1){
					myModal('accept', 'Servidor atualizado');
				}else if(resposta == 2){
					myModal('alert', 'E-mail invalido!');
				}else{
					myModal('alert', 'Preencha todos os campos!');
				}
			},
			complete: function(){
				forma.find('.load').fadeOut('fast');
			},
			error: function(){
				alert('Error');
			}
		});
		return false;
	});


	//Testa EMAIL
	$('.j_config_email_teste').click(function(){
		var forma = $('form[name=config_email]');
		var dados = 'acao=mailserver_teste&' + forma.serialize();
		$.ajax({
			url: link,
			data: dados,
			type: 'POST',
			beforeSend: function(){
				forma.find('.load').fadeIn('fast');
			},
			success: function(resposta){
				if(resposta.indexOf('error') == -1){
					myModal('accept', 'Email enviado com sucesso!');
				}else{
					myModal('error', 'Algo errado aconteceu!');
				}
			},
			complete: function(){
				forma.find('.load').fadeOut('fast');
			},
			error: function(){
				alert('Error');
			}
		});
	});

	//SEO/SOCIAL
	$('form[name="config_seo"]').submit(function(){
		var forma = $(this);
		var dados = 'acao=seo_atualiza&' + $(this).serialize();
		$.ajax({
			url: link,
			data: dados,
			type: 'POST',
			beforeSend: function(){
				forma.find('.load').fadeIn('fast');
			},
			success: function(resposta){
				if(resposta == 1){
					myModal('accept', 'Dadoos atualizados!');
				}else if(resposta == 0){
					myModal('alert', 'Preencha todos os campos!');
				}else{
					myModal('error', 'Algo muito errado aconteceu!');
				}
			},
			complete: function(){
				forma.find('.load').fadeOut('fast');
			},
			error: function(){
				alert('Error');
			}
		});
		return false;
	});

	$('form[name="config_dados"]').submit(function(){
		var forma = $(this);
		var dados = 'acao=atualizaEndtel&' + $(this).serialize();
		$.ajax({
			url: link,
			data: dados,
			type: 'POST',
			beforeSend: function(){
				forma.find('.load').fadeIn('fast');
			},
			success: function(resposta){
				if(resposta == 1){
					myModal('accept', 'Dadoos atualizados!');
				}else if(resposta == 0){
					myModal('alert', 'Preencha todos os campos!');
				}else{
					myModal('error', 'Algo muito errado aconteceu!');
				}
			},
			complete: function(){
				forma.find('.load').fadeOut('fast');
			},
			error: function(){
				alert('Error');
			}
		});
		return false;
	});
});

$( window ).load(function() {
	$('.loadsistem').fadeOut('slow',function(){
		$('.dialog').fadeOut('fast');
	});
});